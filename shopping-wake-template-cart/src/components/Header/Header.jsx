import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import backArrow from '../../assets/images/back_arrow.svg'
import share from '../../assets/images/share.svg'

export default function Header(props) {
	const { cart } = props

	const [isScrolled, setIsScrolled] = useState(false)

	const handleShared = async () => {
		await Eitri.share.text({
			text: `Oi! Essas foram as minhas peças favoritas. É só clicar no link pra conferir. Espero que você goste. 
			https://www.loja.com.br/checkout/?orderFormId=${cart?.cartId}#/cart`
		})
	}

	const navigateBack = () => {
		Eitri.navigation.back()
	}

	return (
		<>
			<View className={`fixed top-0 z-[999] w-screen transition-colors duration-500 bg-base-100`}>
				<View
					topInset={'auto'}
					className='bg-base-100 w-screen'
				/>

				<View className='flex flex-row items-center justify-between p-4'>
					<View onClick={navigateBack}>
						<Image
							src={backArrow}
							width='20'
							height='20'
						/>
					</View>

					<View className='flex flex-row items-center gap-2'>
						<Text className='text-lg font-semibold'>Sacola</Text>
						{cart?.products?.length > 0 && (
							<View className='bg-meteorite-01 rounded-full min-w-[20px] h-5 flex items-center justify-center px-1'>
								<Text className='text-white text-xs font-medium'>
									{cart.products.reduce((total, item) => total + item.quantity, 0)}
								</Text>
							</View>
						)}
					</View>

					{/* Botão de compartilhar comentado - site não funciona
					<View onClick={handleShared}>
						<Image
							src={share}
							width='20'
							height='20'
						/>
					</View>
					*/}
					<View></View>
				</View>
			</View>

			<View>
				<View
					topInset={'auto'}
					className='bg-base-100 w-screen'
				/>
				<View className='h-[52px] w-screen bg-base-100' />
			</View>
		</>
	)
}
