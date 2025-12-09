import { useCheckout } from '../../providers/UseCheckout'
import Eitri from 'eitri-bifrost'
import { openOrderDetails } from '../../services/NavigationService'
import copyIcon from '../../assets/images/copy.svg'
import { CustomButton } from 'shopping-wake-template-shared'

export default function OrderCompleteInstantPaymentInfo(props) {
	const { ...rest } = props
	const { order } = useCheckout()

	const copyQrCode = async () => {
		await Eitri.clipboard.setText({
			text: order?.instantPaymentDetails?.qrCode
		})
	}

	const goToOrders = async () => {
		openOrderDetails(order?.id)
		Eitri.close()
	}

	return (
		<View {...rest}>
			<View className='rounded-lg border border-gray-200 p-4'>
				{/* Instructions */}
				<View className='mb-4'>
					<Text className='mb-2 text-sm font-medium block'>Copie o código a seguir para pagar</Text>

					<View className='space-y-1 text-primary-500'>
						<Text className='block text-xs'>• Acesse seu Internet Banking</Text>
						<Text className='block text-xs'>• Escolha o pagamento via PIX</Text>
						<Text className='block text-xs'>• Cole o código abaixo</Text>
					</View>
				</View>

				{/* Info Box */}
				<View className='mt-2 flex items-center gap-2 p-2'>
					<Text className='text-xs text-gray-700'>Com o PIX, seu pagamento é creditado na hora.</Text>
				</View>

				{/* QR Code String */}
				<View className='mt-6 border border-dashed border-gray-300 p-3'>
					<Text className='truncate font-mono text-sm text-primary-500 block'>
						{order?.instantPaymentDetails?.qrCode}
					</Text>
				</View>

				{/* QR Code Image */}
				<View className='mt-6 flex justify-center'>
					<Image
						src={order?.instantPaymentDetails?.qrCodeUrl}
						className='h-32 w-32'
					/>
				</View>

				{/* Copy Button */}
				<CustomButton
					onClick={copyQrCode}
					label='Copiar código'
					className='mt-4'
				/>

				{/* My Orders Link */}
				<View
					className='mt-4 flex justify-center'
					onClick={goToOrders}>
					<Text className='text-xs text-primary-500 underline'>Ver em meus pedidos</Text>
				</View>
			</View>
		</View>
	)
}
