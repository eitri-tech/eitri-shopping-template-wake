import { useCheckout } from '../../providers/UseCheckout'
import paymentConfirmedIcon from '../../assets/images/paymentConfirmedIcon.svg'
import { PAYMENT_METHODS } from '../../utils/Constants'

export default function OrderCompletedInfo(props) {
	const { ...rest } = props
	const { order } = useCheckout()

	return (
		<View {...rest}>
			<View className='flex flex-col items-center justify-center gap-4 text-center'>
				{/* Success Icon */}
				{order?.isPaid && (
					<View className='flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
						<Image
							src={paymentConfirmedIcon}
							className='h-10 w-10'
						/>
					</View>
				)}

				{/* Main Title */}
				<Text className='text-sm font-semibold'>
					{order?.isPaid ? 'Pedido confirmado!' : 'Pedido registrado com sucesso!'}
				</Text>

				{/* Description */}
				<View className='max-w-md'>
					<Text className='text-xs text-primary-500'>
						{order?.paymentMethod === PAYMENT_METHODS.INSTANT_PAYMENT
							? `Realize o pagamento via PIX em até ${order?.instantPaymentDetails?.qrCodeExpirationDateFormatted} e aguarde a confirmação no app e no email`
							: `Enviamos uma confirmação com os detalhes do seu pedido para `}
					</Text>
					{order?.paymentMethod !== PAYMENT_METHODS.INSTANT_PAYMENT && (
						<Text className='font-semibold text-xs'>{order?.email}</Text>
					)}
				</View>

				{/* Order ID */}
				<View className='mt-2 w-full'>
					<Text className='text-xs block'>Seu código de pedido é</Text>
					<Text className='text-xs font-medium'>{order?.orderId}</Text>
				</View>
			</View>
		</View>
	)
}
