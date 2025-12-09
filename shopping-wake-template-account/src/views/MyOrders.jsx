import { HeaderContentWrapper, HeaderReturn, HeaderText, LoadingComponent } from 'shopping-wake-template-shared'
import OrderCard from '../components/OrderCard/OrderCard'
import { listOrders } from '../services/CustomerService'
import { logScreenView } from '../services/TrackingService'

export default function MyOrders(props) {
	const PAGE = 'Meus Pedidos'
	const [orderFilter, setOrderFilter] = useState('Todos')
	const [isLoading, setIsLoading] = useState(true)
	const [orders, setOrders] = useState([])

	useEffect(() => {
		listOrders()
			.then(result => {
				setOrders(result?.customer?.orders?.items ?? [])
				setIsLoading(false)
			})
			.catch(error => {
				console.error('Error fetching orders:', error)
				setIsLoading(false)
			})

		logScreenView(PAGE)
	}, [])

	console.log('ORDERS', orders)

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper
				className='flex items-center justify-between bg-accent-300 py-2'
				scrollEffect={false}>
				<HeaderReturn />

				<HeaderText text='Meus pedidos' />

				<View className='w-5' />
			</HeaderContentWrapper>

			<LoadingComponent
				isLoading={isLoading}
				fullScreen
			/>

			<View className='p-4 flex flex-col items-center gap-4 w-full'>
				<View className='flex flex-col items-center gap-6 w-full'>
					{orders && orders.length ? (
						orders.map((order, index) => (
							<View
								key={order.orderId}
								className={`w-full ${index > 0 ? 'border-t border-t-primary-700 pt-5' : 'pt-0'}`}>
								<OrderCard order={order} />
							</View>
						))
					) : (
						<NoItem
							title='Você não possui nenhum pedido'
							subtitle='Quando você fizer uma compra, ela será listada aqui.'
						/>
					)}
				</View>
			</View>
		</Page>
	)
}
