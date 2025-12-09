import { HeaderContentWrapper, CustomButton } from 'shopping-wake-template-shared'
import Eitri from 'eitri-bifrost'
import { deleteCart } from '../services/CheckoutServices'
import { logScreenView, sendLogError } from '../services/TrackingService'
import { useEffect } from 'react'
import info from '../assets/images/info.svg'

export default function CheckoutAlreadyPaidError() {
	const PAGE = '[Erro] Carrinho já finalizado'

	useEffect(() => {
		logScreenView(PAGE, 'CheckoutAlreadyPaidError')
		sendLogError({ message: 'Carrinho já finalizado' }, '', {
			screen: 'CheckoutAlreadyPaidError'
		})
	}, [])

	const closeApp = async () => {
		await deleteCart()
		Eitri.close()
	}

	const goToOrders = async () => {
		await deleteCart()
		Eitri.nativeNavigation.open({
			slug: 'account',
			initParams: {
				action: 'orderlist'
			}
		})
		Eitri.close()
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper />

			<View className='flex h-full flex-col items-center justify-center'>
				<View className='w-full max-w-md p-8 text-center'>
					{/* Icon */}
					<View className='mx-auto mb-6 flex items-center justify-center'>
						<Image
							src={info}
							className='h-9 w-9'
						/>
					</View>

					{/* Text Content */}
					<View className='space-y-4'>
						<Text className='text-sm font-bold block'>Esta sacola já foi finalizada</Text>
						<Text className='text-xs'>Veja seus pedidos para mais detalhes.</Text>
					</View>

					{/* Action Buttons */}
					<View className='mt-8 flex flex-col gap-4'>
						<CustomButton
							onClick={goToOrders}
							label='Ir para meus pedidos'
						/>
						<View
							onClick={closeApp}
							className='cursor-pointer py-2'>
							<Text className='text-xs underline'>Continuar comprando</Text>
						</View>
					</View>
				</View>
			</View>
		</Page>
	)
}
