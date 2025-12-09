import { useState } from 'react'
import { View, Text, Image, Button } from 'eitri-luminus'
import { CustomButton } from 'shopping-wake-template-shared'
import { formatCurrency, formatImageUrl } from '../../utils/Util'
import closeIcon from '../../assets/images/close.svg'

export default function CartItem(props) {
	const { item, handleRemoveCartItem, handleAddCartItem, goToProduct } = props

	const [loadingRemoveProduct, setLoadingRemoveProduct] = useState(false)
	const [msgError, setMsgError] = useState('')

	const [modalConfirm, setModalConfirm] = useState(false)

	const resizedImageUrl = formatImageUrl(item.imageUrl)
	const formattedName = item.name.split(' - ')[0].trim()

	// Extrair tamanho e cor do productAttributes
	let size = null
	let color = null

	if (item.productAttributes) {
		const sizeAttr = item.productAttributes.find(attr => attr.name?.toUpperCase() === 'TAMANHO')
		if (sizeAttr) {
			size = sizeAttr.value
		}

		const colorAttr = item.productAttributes.find(attr => attr.name?.toUpperCase() === 'COR')
		if (colorAttr) {
			color = colorAttr.value
		}
	}

	const removeProduct = async () => {
		setLoadingRemoveProduct(true)
		setModalConfirm(false)
		await handleRemoveCartItem(item.productVariantId, item.quantity)
		setMsgError('')
		setLoadingRemoveProduct(false)
	}

	const decreaseProduct = async () => {
		// Se a quantidade atual for 1, exibir modal de confirmação
		if (item.quantity === 1) {
			setModalConfirm(true)
			return
		}

		await handleRemoveCartItem(item.productVariantId, 1)
		setMsgError('')
	}

	const addProduct = async () => {
		try {
			const lastQuantity = item.quantity
			const result = await handleAddCartItem(item.productVariantId, 1)

			if (result?.products?.length) {
				const product = result.products.find(p => p.productVariantId === item.productVariantId)
				if (product && lastQuantity >= product.quantity) {
					setMsgError('Não foi possível adicionar à sacola')
					return
				}
			}
			setMsgError('')
		} catch (e) {
			setMsgError('Não foi possível adicionar à sacola')
		}
	}

	return (
		<>
			<View
				key={`item_${item.productVariantId}`}
				className='mx-4 mb-4 p-4 bg-white border border-neutral-200 rounded'>
				<View className='flex flex-row gap-4 items-stretch'>
					{/* Imagem do produto */}
					<View
						className='min-w-[33%] max-w-[33%] flex items-center justify-center border border-neutral-100 bg-neutral-50 cursor-pointer overflow-hidden'
						onClick={() => goToProduct(item.productId)}>
						<Image
							className='w-full h-full object-cover'
							src={resizedImageUrl}
						/>
					</View>

					{/* Informações do produto */}
					<View className='flex-1 flex flex-col justify-between min-h-full'>
						{/* Nome do produto */}
						<View className='mb-3'>
							<Text
								className='text-base font-medium leading-5 cursor-pointer line-clamp-2 text-gray-800'
								onClick={() => goToProduct(item.productId)}>
								{formattedName}
							</Text>
							{/* Atributos do produto (tamanho e cor) */}
							{(size || color) && (
								<View className='flex flex-row gap-3 mt-1'>
									{size && (
										<View className='text-xs text-gray-500 border border-black rounded-[5px] px-3'>
											{size}
										</View>
									)}
									{color && (
										<View className='text-xs text-gray-500 border border-black rounded-[5px] px-3'>
											{color}
										</View>
									)}
								</View>
							)}
						</View>

						{/* Preço */}
						<View className='mb-3'>
							<Text className='text-lg font-bold text-meteorite-01'>
								{formatCurrency(item.price * item.quantity)}
							</Text>
						</View>

						{/* Controles de quantidade */}
						<View className='flex flex-row items-center justify-between'>
							<View className='h-[30px] flex flex-row items-center gap-3 rounded py-1 px-1.5 border border-black'>
								<View
									className='h-full flex items-center justify-center border-r border-black pr-1 w-[30px]'
									onClick={decreaseProduct}>
									<svg
										width='9'
										height='3'
										viewBox='0 0 9 3'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<rect
											width='9'
											height='3'
											fill='black'></rect>
									</svg>
								</View>
								<Text className='text-base font-medium w-8 text-center'>{item.quantity}</Text>
								<View
									className='h-full flex items-center justify-center border-l border-black pl-1 w-[30px]'
									onClick={addProduct}>
									<svg
										width='9'
										height='9'
										viewBox='0 0 9 9'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<rect
											y='3'
											width='9'
											height='3'
											fill='black'></rect>
										<rect
											x='3'
											y='9'
											width='9'
											height='3'
											transform='rotate(-90 3 9)'
											fill='black'></rect>
									</svg>
								</View>
							</View>

							{/* Botão remover */}
							<View onClick={() => setModalConfirm(true)}>
								<svg
									width='19'
									height='20'
									viewBox='0 0 19 20'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M9.24635 20.0001C7.89135 20.0001 6.57035 19.9852 5.26335 19.9581C3.59135 19.9251 2.43435 18.8411 2.24535 17.1291C1.93035 14.2891 1.39135 7.59515 1.38635 7.52815C1.35235 7.11515 1.66035 6.75315 2.07335 6.72015C2.48035 6.70915 2.84835 6.99515 2.88135 7.40715C2.88635 7.47515 3.42435 14.1461 3.73635 16.9641C3.84335 17.9371 4.36835 18.4391 5.29435 18.4581C7.79435 18.5112 10.3454 18.5141 13.0954 18.4641C14.0794 18.4451 14.6114 17.9531 14.7214 16.9571C15.0314 14.1631 15.5714 7.47515 15.5774 7.40715C15.6104 6.99515 15.9754 6.70715 16.3844 6.72015C16.7974 6.75415 17.1054 7.11515 17.0724 7.52815C17.0664 7.59615 16.5244 14.3071 16.2124 17.1221C16.0184 18.8691 14.8644 19.9321 13.1224 19.9641C11.7894 19.9871 10.5034 20.0001 9.24635 20.0001Z'
										fill='black'></path>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M17.708 4.98926H0.75C0.336 4.98926 0 4.65326 0 4.23926C0 3.82526 0.336 3.48926 0.75 3.48926H17.708C18.122 3.48926 18.458 3.82526 18.458 4.23926C18.458 4.65326 18.122 4.98926 17.708 4.98926Z'
										fill='black'></path>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M14.4406 4.98949C13.3026 4.98949 12.3146 4.17849 12.0906 3.06249L11.8476 1.84649C11.7966 1.66149 11.5856 1.50049 11.3456 1.50049H7.11258C6.87258 1.50049 6.66158 1.66149 6.60058 1.89249L6.36758 3.06249C6.14458 4.17849 5.15558 4.98949 4.01758 4.98949C3.60358 4.98949 3.26758 4.65349 3.26758 4.23949C3.26758 3.82549 3.60358 3.48949 4.01758 3.48949C4.44358 3.48949 4.81358 3.18549 4.89758 2.76749L5.14058 1.55149C5.38758 0.619488 6.19458 0.000488281 7.11258 0.000488281H11.3456C12.2636 0.000488281 13.0706 0.619488 13.3076 1.50649L13.5616 2.76749C13.6446 3.18549 14.0146 3.48949 14.4406 3.48949C14.8546 3.48949 15.1906 3.82549 15.1906 4.23949C15.1906 4.65349 14.8546 4.98949 14.4406 4.98949Z'
										fill='black'></path>
								</svg>
							</View>
						</View>

						{/* Mensagem de erro */}
						{msgError && (
							<View className='mt-2'>
								<Text className='text-xs text-red-600 font-medium'>{msgError}</Text>
							</View>
						)}
					</View>
				</View>
			</View>

			{modalConfirm && (
				<View
					className='z-[9999] !bg-black/70 !opacity-100 fixed inset-0 flex items-center justify-center p-4'
					onClick={() => setModalConfirm(false)}>
					<View
						className='bg-white rounded-2xl p-6 flex flex-col items-center gap-4 w-full max-w-sm shadow-2xl'
						onClick={e => e.stopPropagation()}>
						{/* Título e descrição */}
						<View className='text-center'>
							<Text className='text-lg font-bold text-gray-900'>Remover produto</Text>
						</View>

						<View className='text-center'>
							<Text className='text-sm text-gray-600 leading-relaxed'>
								Tem certeza que deseja remover este produto da sua sacola?
							</Text>
						</View>

						{/* Botões */}
						<View className='flex flex-col gap-3 w-full'>
							<CustomButton
								label='Sim, remover'
								className='!bg-red-500 hover:!bg-red-600 !border-red-500 rounded-xl w-full py-3 !text-white font-semibold'
								onClick={removeProduct}
								isLoading={loadingRemoveProduct}
							/>
							<CustomButton
								label='Cancelar'
								className='!bg-transparent border border-gray-300 rounded-xl w-full py-3 text-gray-700 font-medium hover:bg-gray-50'
								onClick={() => setModalConfirm(false)}
							/>
						</View>
					</View>
				</View>
			)}
		</>
	)
}
