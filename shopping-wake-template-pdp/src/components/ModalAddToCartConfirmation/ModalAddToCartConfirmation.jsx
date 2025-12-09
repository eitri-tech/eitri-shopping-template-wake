import Eitri from 'eitri-bifrost'
import { CustomButton, BottomInset } from 'shopping-wake-template-shared'
import { useState } from 'react'
import { formatCurrency, formatImageUrl } from '../../utils/Util'
import { openCart } from '../../services/NavigationService'
import closeIcon from '../../assets/icons/close.svg'

export default function ModalAddToCartConfirmation(props) {
	const { closeModal, product } = props

	const goToCart = async () => {
		openCart()
	}

	const getVariantName = () => {
		return product?.attributeSelections?.selectedVariant?.productVariantName ?? product?.variantName
	}

	return (
		<View
			className='z-[9999] !bg-black/70 !opacity-100 fixed inset-0 flex items-end justify-center'
			onClick={closeModal}>
			<View
				className='bg-base-100 p-4 w-screen'
				onClick={e => e.stopPropagation()}>
				<View className='flex justify-between items-center mb-4'>
					<View />
					<Text>Produto adicionado!</Text>

					<View
						className=''
						onClick={closeModal}>
						<Image
							src={closeIcon}
							alt='Ícone de fechar'
							width={12}
						/>
					</View>
				</View>

				<View className='flex gap-4'>
					<Image
						width={90}
						borderRadius='micro'
						src={formatImageUrl(product?.images?.[0]?.url)}
					/>

					<View className='flex flex-col gap-2'>
						<Text className='text-sm'>{getVariantName()}</Text>

						<Text color='text-sm'>{formatCurrency(product?.prices?.price)}</Text>
					</View>
				</View>

				<View className='grid grid-cols-2 gap-4 mt-4'>
					<CustomButton
						label='Continuar comprando'
						outlined
						onClick={closeModal}
					/>
					<CustomButton
						label='Finalizar compra'
						onClick={goToCart}
					/>
				</View>
				<BottomInset />
			</View>
		</View>
	)
}
