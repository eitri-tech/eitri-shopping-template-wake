import { useState, useRef } from 'react'
import { View, Loading, Text, Image } from 'eitri-luminus'
import { useNotification } from '../Notification/NotificationProvider'
import { openProduct } from '../../services/NavigationService'
import noImage from '../../assets/images/no_image.png'
import { formatCurrency, formatImageUrl } from '../../utils/Util'
import { getProductByVariations, getProductVariations } from '../../services/ProductService'
import FavoriteButton from '@/components/productCard/FavoriteButton'
import plusIcon from '../../assets/images/plus.svg'
import bagIcon from '../../assets/images/plus.svg'
import addIcon from '../../assets/images/plus.svg'
import closeIcon from '../../assets/images/close.svg'
import { useLocalShoppingCart } from '../../providers/LocalCart'

export default function SliderProductItem(props) {
	const { product, width, saveFavorite, showProductInfo, showFavoriteIcon } = props

	const { addItem } = useLocalShoppingCart()

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
			const allVariations = await getProductVariations(product.productId)
			const _variations = allVariations.filter(a => {
				if (/\bcor\b/.test(a?.name?.toLowerCase())) {
					selectedVariation.current = {
						...selectedVariation.current,
						[`${a?.attributeId}`]: a?.values?.[0]?.value
					}
					return false
				}
				return true
			})
			// _variations[0].values = [..._variations[0].values, ..._variations[0].values, ..._variations[0].values]
			setVariations(_variations)
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
			const cart = await addItem(_product.productVariantId, 1)
			const successful = cart.products.find(p => p.productVariantId === _product.productVariantId)
			if (successful) {
				showNotification('Produto adicionado à sacola!')
				setClickedBuyLink(false)
			} else {
				showNotification('Falhou ao adicionar produto')
			}
		} catch (e) {
			showNotification('Erro ao adicionar produto')
			console.error('buyItem', e)
		}
		setLoadingVariations(false)
	}

	const notifyMe = async (variationId, value) => {
		console.log('notifyMe', variationId, value)
	}

	return (
		<View
			className='relative shadow-sm flex flex-col snap-start flex-shrink-0'
			style={{ width: width || '100%' }}>
			{showFavoriteIcon && <FavoriteButton productId={product.productId} />}

			<View className='w-full h-full flex flex-col gap-1'>
				<View
					className='relative'
					onClick={() => goToProduct(product)}>
					<Image
						className='w-full bg-neutral-100 object-cover bg-center'
						src={product.images.length > 0 ? formatImageUrl(product.images[0].url) : noImage}
					/>

					{/* Tags do produto no canto superior esquerdo */}
					{productTags.length > 0 && (
						<View className='absolute top-2 left-2 flex flex-col gap-1'>
							{productTags.map((tag, index) => (
								<View
									key={index}
									className={`px-2 py-1 text-xs ${tag.className}`}>
									<Text className='text-xs font-bold text-white'>{tag.label}</Text>
								</View>
							))}
						</View>
					)}

					{/* Botão do carrinho no canto inferior direito */}
					{!clickedBuyLink ? (
						<View
							onClick={e => {
								e.stopPropagation()
								openVariations()
							}}
							className='absolute bottom-2 right-2 w-9 h-9 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm'>
							<Image
								src={bagIcon}
								width={20}
								height={20}
							/>
							{/* Ícone add no topo direito */}
							<View className='absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center'>
								<Image
									src={addIcon}
									width={12}
									height={12}
								/>
							</View>
						</View>
					) : null}

					{/* Modal de seleção de tamanhos */}
					{clickedBuyLink && (
						<View className='absolute inset-x-0 bottom-2 flex flex-col justify-end items-center'>
							{/* Conteúdo do modal - com espaçamento da borda */}
							<View
								className='bg-white mx-2 p-3 border border-gray-200 shadow-sm text-center'
								onClick={e => e.stopPropagation()}>
								{/* Botão fechar no canto superior direito do modal */}
								{/* Botão fechar no canto superior direito do modal */}
								<View
									className='absolute top-0 right-2 w-5 h-5 flex items-center justify-center cursor-pointer'
									onClick={e => {
										e.stopPropagation()
										setClickedBuyLink(false)
									}}>
									<Image
										src={closeIcon}
										width={8}
										height={8}
									/>
								</View>

								{/* Título */}
								<View className='text-center mb-3'>
									<Text className='text-sm font-medium'>
										Clique no tamanho para <Text className='font-bold'>adicionar</Text>.
									</Text>
								</View>

								{/* Loading */}
								{loadingVariations && (
									<View className='flex justify-center py-2'>
										<Loading className='loading-dots loading-sm text-gray-400' />
									</View>
								)}

								{/* Tamanhos disponíveis - layout horizontal centralizado */}
								{!loadingVariations && variations?.length > 0 && (
									<View className='flex flex-row gap-2 justify-center'>
										{variations?.map((variation, idx) => (
											<View
												key={idx}
												className='flex flex-row gap-2'>
												{variation?.values?.map((variationItem, idx2) => (
													<View
														key={idx2}
														className={`relative w-10 h-6 border border-black rounded cursor-pointer flex items-center justify-center ${
															variationItem?.available
																? 'bg-white hover:bg-gray-50'
																: 'bg-gray-100'
														}`}
														onClick={() =>
															variationItem?.available
																? buyItem(variation?.attributeId, variationItem?.value)
																: notifyMe(variation?.attributeId, variationItem?.value)
														}>
														<Text
															className={`text-center font-medium text-xs ${
																variationItem?.available
																	? 'text-black'
																	: 'text-gray-400'
															}`}>
															{variationItem?.value}
														</Text>
														{variationItem?.available && (
															<View className='absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center'>
																<Image
																	src={addIcon}
																	width={16}
																	height={16}
																/>
															</View>
														)}
													</View>
												))}
											</View>
										))}
									</View>
								)}
							</View>
						</View>
					)}
				</View>

				{/* Informações do produto: Nome, Valor */}
				<View className='w-full flex flex-col gap-1 p-2'>
					{/* Nome do produto */}
					<Text className='text-sm font-medium line-clamp-2'>{product.productName}</Text>

					{/* Preços */}
					<View className='flex flex-col gap-1'>
						{/* Preço com desconto (se houver) ou preço normal */}
						<Text className='text-sm font-bold text-gray-900'>{formatCurrency(product.prices.price)}</Text>

						{/* Preço original riscado (só aparece se houver desconto) */}
						{getDiscountPercentage() && (
							<Text className='text-xs text-gray-500 line-through'>
								{formatCurrency(product.prices.listPrice)}
							</Text>
						)}
					</View>
				</View>
			</View>
		</View>
	)
}
