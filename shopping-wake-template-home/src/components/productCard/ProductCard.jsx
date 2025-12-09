import { useState, useRef } from 'react'
import { View, Loading, Text, Image } from 'eitri-luminus'
import { openProduct } from '../../services/NavigationService'
import noImage from '../../assets/images/no_image.png'
import { formatCurrency, formatImageUrl } from '../../utils/Util'
import { getProductByVariations, getProductVariations } from '../../services/ProductService'
import { addItemToCart } from '../../services/CartService'
import { useNotification } from '../Notification/NotificationProvider'
import FavoriteButton from './FavoriteButton'
import bagIcon from '../../assets/images/bag.svg'
import addIcon from '../../assets/images/add.svg'

export default function ProductCard(props) {
	const {
		product,
		width,
		saveFavorite,
		showProductInfo,
		showFavoriteIcon,
		onlyImage,
		openVariationsModal,
		disableImageScroll
	} = props

	// Função para obter percentual de desconto da API
	const getDiscountPercentage = () => {
		const discountFromAPI = product?.prices?.discountPercentage

		if (discountFromAPI && discountFromAPI > 0) {
			const calculatedPercentage = Math.floor(discountFromAPI * 100)
			return calculatedPercentage // Converter de decimal para percentual e arredondar para baixo (ex: 0.250000003 -> 25)
		}

		return null
	}

	// Função para gerar tags baseadas nos dados do produto
	const getProductTags = () => {
		const tags = []

		// Tag de desconto
		const discountPercentage = getDiscountPercentage()
		if (discountPercentage && discountPercentage > 0) {
			tags.push({
				label: `-${discountPercentage}%`,
				className: 'bg-red-600 text-white'
			})
		}

		// Tag "NEW" para produtos com ID alto (mais recentes)
		if (product?.productId > 82000) {
			tags.push({ label: 'NEW', className: 'bg-black text-white' })
		}

		return tags
	}

	const productTags = getProductTags()

	const [clickedBuyLink, setClickedBuyLink] = useState(false)
	const [variations, setVariations] = useState([])
	const [loadingVariations, setLoadingVariations] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)
	const { showNotification } = useNotification()

	const selectedVariation = useRef({})
	
	const goToProduct = product => {
		openProduct(product.productId, product.productVariantId)
	}

	const saveFavoriteProduct = async (productId, productVariantId) => {
		// TODO - implementar loading de wishList
		await saveFavorite(productId, productVariantId)
	}

	const openVariations = async () => {
		setClickedBuyLink(true)
		setLoadingVariations(true)
		try {
			const _variations = await getProductVariations(product.productId)

			// Filtrar excluindo variações de cor (mesmo padrão do SliderProductItem)
			const filteredVariations = _variations.filter(a => {
				if (/\bcor\b/.test(a?.name?.toLowerCase())) {
					selectedVariation.current = {
						...selectedVariation.current,
						[`${a?.attributeId}`]: a?.values?.[0]?.value
					}
					return false
				}
				return true
			})

			setVariations(filteredVariations)
		} catch (e) {
			console.error('openVariations', e)
		}
		setLoadingVariations(false)
	}

	const buyItem = async (variationId, value) => {
		setLoadingVariations(true)
		try {
			selectedVariation.current = { ...selectedVariation.current, [`${variationId}`]: value }
			const _selectedVariations = []
			Object.keys(selectedVariation.current).map(key => {
				_selectedVariations.push({
					attributeId: Number(key),
					value: selectedVariation.current[key]
				})
			})

			const _product = await getProductByVariations(product.productId, _selectedVariations)
			const cart = await addItemToCart(_product.productVariantId, 1)
			const successful = cart.products.find(p => p.productVariantId === _product.productVariantId)
			if (successful) {
				showNotification()
				setClickedBuyLink(false)
			} else {
				showNotification()
			}
		} catch (e) {
			showNotification()
			console.error('buyItem', e)
		}
		setLoadingVariations(false)
	}

	const images = product?.images?.filter((_, index) => index !== 1)

	return (
		<View className='relative flex flex-col snap-start flex-shrink-0 w-full'>
			{showFavoriteIcon && (
				<FavoriteButton
					productId={product.productId}
					productVariantId={product.productVariantId}
					productName={product.productName}
					productPrice={product.prices.price}
				/>
			)}

			<View className='w-full h-full flex flex-col gap-1'>
				{onlyImage ? (
					<View
						className='relative aspect-[350/449]'
						onClick={() => goToProduct(product)}>
						{/* Tags do produto */}
						{productTags.length > 0 && (
							<View className='absolute top-2 left-2 z-10 flex flex-row gap-1'>
								{productTags.map((tag, index) => (
									<View
										key={index}
										className={`px-2 py-1 text-xs font-bold ${tag.className}`}>
										<Text className='text-xs font-bold'>{tag.label}</Text>
									</View>
								))}
							</View>
						)}

						<Image
							key={`${images?.[0]?.url || `noImage_${product.productName}`}`}
							loading='lazy'
							className='w-full bg-neutral-100 object-cover bg-center'
							src={formatImageUrl(images?.[0]?.url) || noImageUrl}
						/>
					</View>
				) : (
					<View className='relative flex flex-col h-full'>
						<View
							className={`relative w-full grow-1 ${disableImageScroll ? 'overflow-hidden' : 'overflow-x-auto snap-x snap-mandatory scroll-smooth'} flex flex-row aspect-[350/449]`}
							onClick={() => goToProduct(product)}>
							{images?.length > 0 &&
								images.map((image, index) => (
									<View
										key={`container_${image.url || 'noImage_' + product.productName}_${index}`}
										className={`relative w-full flex-shrink-0 ${disableImageScroll ? (index === 0 ? 'block' : 'hidden') : 'snap-center snap-always'}`}>
										{/* Tags do produto */}
										{productTags.length > 0 && (
											<View className='absolute top-2 left-2 z-20 flex flex-row gap-1'>
												{productTags.map((tag, tagIndex) => (
													<View
														key={tagIndex}
														className={`px-2 py-1 text-xs font-bold ${tag.className}`}>
														<Text className='text-xs font-bold'>{tag.label}</Text>
													</View>
												))}
											</View>
										)}

										{/* Botão de carrinho ou Modal */}
										<View className='absolute bottom-2 right-2 z-20'>
											{!clickedBuyLink ? (
												// Botão de carrinho
												<View
													className='relative w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer'
													onClick={e => {
														e.stopPropagation()
														openVariations()
													}}>
													<Image
														src={bagIcon}
														className='w-4 h-4 z-10'
													/>
													<View className='absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center'>
														<Image
															src={addIcon}
															className='w-2 h-2'
														/>
													</View>
												</View>
											) : (
												// Modal de seleção de tamanhos - na mesma posição da bag
												<View className='flex flex-col justify-end items-end'>
													<View
														className='bg-white border border-gray-200 shadow-sm'
														onClick={e => e.stopPropagation()}>
														{/* Loading */}
														{loadingVariations && (
															<View className='flex justify-center py-2 px-2'>
																<Loading className='loading-dots loading-sm text-gray-400' />
															</View>
														)}

														{/* Tamanhos disponíveis */}
														{!loadingVariations && variations?.length > 0 && (
															<View className='flex flex-row gap-1 p-2'>
																{variations?.map((variation, idx) => (
																	<View
																		key={idx}
																		className='flex flex-row gap-1'>
																		{variation?.values?.map(
																			(variationItem, idx2) => (
																				<View
																					key={idx2}
																					className={`w-6 h-4 border border-black cursor-pointer flex items-center justify-center ${
																						variationItem?.available
																							? 'bg-white hover:bg-gray-50'
																							: 'bg-gray-100'
																					}`}
																					onClick={() =>
																						variationItem?.available
																							? buyItem(
																									variation?.attributeId,
																									variationItem?.value
																								)
																							: null
																					}>
																					<Text
																						className={`text-center font-medium text-[12px] ${
																							variationItem?.available
																								? 'text-black'
																								: 'text-gray-400'
																						}`}>
																						{variationItem?.value}
																					</Text>
																				</View>
																			)
																		)}
																	</View>
																))}
															</View>
														)}
													</View>
												</View>
											)}
										</View>

										<Image
											key={`${image.url || 'noImage_' + product.productName}_${index}`}
											loading='lazy'
											className='w-full bg-neutral-100 object-cover bg-center h-full'
											src={formatImageUrl(image.url) || noImageUrl}
										/>
									</View>
								))}

							{!images ||
								(images?.length === 0 && (
									<View
										key={`container_noImage_${product.productName}`}
										className='relative w-full flex-shrink-0 snap-center snap-always'>
										{/* Tags do produto */}
										{productTags.length > 0 && (
											<View className='absolute top-2 left-2 z-20 flex flex-row gap-1'>
												{productTags.map((tag, tagIndex) => (
													<View
														key={tagIndex}
														className={`px-2 py-1 text-xs font-bold ${tag.className}`}>
														<Text className='text-xs font-bold'>{tag.label}</Text>
													</View>
												))}
											</View>
										)}

										{/* Botão de carrinho ou Modal */}
										<View className='absolute bottom-2 right-2 z-20'>
											{!clickedBuyLink ? (
												// Botão de carrinho
												<View
													className='relative w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer'
													onClick={e => {
														e.stopPropagation()
														openVariations()
													}}>
													<Image
														src={bagIcon}
														className='w-4 h-4 z-10'
													/>
													<View className='absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center'>
														<Image
															src={addIcon}
															className='w-2 h-2'
														/>
													</View>
												</View>
											) : (
												// Modal de seleção de tamanhos - na mesma posição da bag
												<View className='flex flex-col justify-end items-end'>
													<View
														className='bg-white border border-gray-200 shadow-sm'
														onClick={e => e.stopPropagation()}>
														{/* Loading */}
														{loadingVariations && (
															<View className='flex justify-center py-2 px-2'>
																<Loading className='loading-dots loading-sm text-gray-400' />
															</View>
														)}

														{/* Tamanhos disponíveis */}
														{!loadingVariations && variations?.length > 0 && (
															<View className='flex flex-row gap-1 p-2'>
																{variations?.map((variation, idx) => (
																	<View
																		key={idx}
																		className='flex flex-row gap-1'>
																		{variation?.values?.map(
																			(variationItem, idx2) => (
																				<View
																					key={idx2}
																					className={`w-6 h-4 border border-black cursor-pointer flex items-center justify-center ${
																						variationItem?.available
																							? 'bg-white hover:bg-gray-50'
																							: 'bg-gray-100'
																					}`}
																					onClick={() =>
																						variationItem?.available
																							? buyItem(
																									variation?.attributeId,
																									variationItem?.value
																								)
																							: null
																					}>
																					<Text
																						className={`text-center font-medium text-[12px] ${
																							variationItem?.available
																								? 'text-black'
																								: 'text-gray-400'
																						}`}>
																						{variationItem?.value}
																					</Text>
																				</View>
																			)
																		)}
																	</View>
																))}
															</View>
														)}
													</View>
												</View>
											)}
										</View>

										<Image
											key={`noImage_${product.productName}`}
											loading='lazy'
											className='w-full bg-neutral-100 object-cover bg-center h-full'
											src={noImageUrl}
										/>
									</View>
								))}
						</View>

						<View className='w-full flex flex-col gap-1 p-2'>
							{/* Nome do produto */}
							<Text className='text-xs line-clamp-1'>{product.productName}</Text>

							{/* Preços */}
							<View className='flex flex-col gap-1'>
								{/* Preço com desconto (se houver) ou preço normal */}
								<Text className='text-xs font-bold text-gray-900'>
									{formatCurrency(product.prices.price)}
								</Text>

								{/* Preço original riscado (só aparece se houver desconto) */}
								{getDiscountPercentage() && (
									<Text className='text-xs text-gray-500 line-through'>
										{formatCurrency(product.prices.listPrice)}
									</Text>
								)}
							</View>
						</View>
					</View>
				)}
			</View>
		</View>
	)
}
