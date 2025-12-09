import profileIcon from '../../assets/images/profileIcon.svg'
import thunderIcon from '../../assets/images/thunderIcon.svg'
import { useCheckout } from '../../providers/UseCheckout'
import { PAYMENT_METHODS_ICONS } from '../../utils/Constants'

export default function OrderCompletedDetails(props) {
	const { ...rest } = props
	const { order } = useCheckout()

	const DetailCard = ({ icon, title, children }) => (
		<View className=''>
			<View className='flex items-center gap-3'>
				{icon && (
					<Image
						src={icon}
						className='h-6 w-6 flex-shrink-0 text-primary-500'
					/>
				)}

				<Text className='font-medium text-sm'>{title}</Text>
			</View>

			<View className={`mt-3 flex flex-col gap-1${icon ? ' pl-9' : ''}`}>{children}</View>
		</View>
	)

	return (
		<View {...rest}>
			<View className='mb-2'>
				<Text className='text-sm font-medium'>Detalhes do pedido</Text>
			</View>

			<View className='flex flex-col gap-3'>
				{/* Personal Data */}
				<DetailCard title='Dados pessoais'>
					<Text className='text-sm text-gray-600'>{order?.customer?.name}</Text>
					<Text className='text-sm text-gray-600'>{order?.customer?.document}</Text>
				</DetailCard>

				{/* Delivery Info */}
				<DetailCard title={order?.delivery?.type}>
					<Text className='text-sm font-medium text-gray-700'>{order?.delivery?.sla}</Text>
					<Text className='text-sm text-gray-600'>{order?.delivery?.fullAddress}</Text>
				</DetailCard>

				{/* Payment Info */}
				{PAYMENT_METHODS_ICONS[order?.payment?.type] && (
					<DetailCard title={order?.payment?.name}>
						{order?.payment?.info && (
							<Text className='text-sm font-medium text-gray-700'>{order?.payment?.info}</Text>
						)}
						{order?.payment?.additionalInfo && (
							<Text className='text-sm text-gray-600'>{order?.payment?.additionalInfo}</Text>
						)}
					</DetailCard>
				)}
			</View>
		</View>
	)
}
