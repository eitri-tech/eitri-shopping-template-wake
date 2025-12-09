import HeaderTemplate from '../components/Shared/HeaderTemplate/HeaderTemplate'
import OrderTimeline from '../components/OrderTimeline/OrderTimeline'
import PurchasedProductsCard from '../components/PurchasedProductsCard/PurchasedProductsCard'
import PaymentMethodCard from '../components/PaymentMethodCard/PaymentMethodCard'
import DeliveryAddressCard from '../components/DeliveryAddressCard/DeliveryAddressCard'
import OrderSummaryCard from '../components/OrderSummaryCard/OrderSummaryCard'
import { logScreenView } from '../services/TrackingService'
import PaymentData from '../components/PaymentData/PaymentData'
import { HeaderContentWrapper, HeaderReturn, HeaderText } from 'shopping-wake-template-shared'
import { formatDateDaysMonthYear } from '../utils/Util'

export default function OrderDetail(props) {
	const PAGE = 'Detalhes do pedido'

	const [order, setOrder] = useState(null)
	const [borderColor, setBorderColor] = useState('')
	const [textColor, setTextColor] = useState('')

	useEffect(() => {
		const order = props.location?.state?.order
		setOrder(order)

		switch (order?.status?.status) {
			case 'Pedido Cancelado':
				setBorderColor('border-negative-700')
				setTextColor('text-negative-700')
				break
			case 'Aguardando Pagamento':
				setBorderColor('border-warning-700')
				setTextColor('text-warning-700')
				break
			default:
				setBorderColor('border-primary-100')
				setTextColor('text-primary-100')
				break
		}

		logScreenView(PAGE)
	}, [])

	const blockedStatuses = ['Pedido Cancelado', 'Pedido Entregue', 'Pagamento Negado']

	const showInfoDelivery = !(
		blockedStatuses.includes(order?.status?.status) ||
		order?.statusHistory.some(item => blockedStatuses.includes(item?.status))
	)

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper
				className='flex items-center justify-between bg-accent-300 py-2'
				scrollEffect={false}>
				<HeaderReturn />

				<HeaderText text='Detalhes do pedido' />

				<View className='w-5' />
			</HeaderContentWrapper>

			<View className='flex flex-col gap-4 p-4 mt-4'>
				<View className='flex items-center justify-between'>
					<View className='flex flex-col'>
						<Text>Pedido:</Text>

						<Text className='text-xs'>{order?.orderId}</Text>
					</View>

					<View className={`flex items-center p-2 border ${borderColor}`}>
						<Text className={`text-xs ${textColor}`}>{order?.status?.status}</Text>
					</View>
				</View>

				<View>
					{order?.shippings?.deadline && (
						<Text className='font-medium text-xs'>
							{`Seu pedido chega até ${order?.shippings?.deadline?.[0]}`}
						</Text>
					)}

					<View className='flex flex-col gap-1'>
						<Text>Data do Pedido:</Text>

						<Text className='text-xs'>{formatDateDaysMonthYear(order?.date)}</Text>
					</View>
				</View>

				{showInfoDelivery && (
					<View className='flex items-center gap-2 py-2'>
						<Text className='text-[10px]'>
							O tempo de entrega pode variar de acordo com feriados nacionais, estaduais e municipais.
						</Text>
					</View>
				)}

				{/* <OrderTimeline order={order} /> */}

				<DeliveryAddressCard order={order} />

				<PaymentMethodCard order={order} />

				{order?.payments[0].pix?.qrCode && order?.status?.status === 'Aguardando Pagamento' && (
					<PaymentData payment={order?.payments[0]} />
				)}

				<OrderSummaryCard order={order} />

				<PurchasedProductsCard order={order} />
			</View>
		</Page>
	)
}
