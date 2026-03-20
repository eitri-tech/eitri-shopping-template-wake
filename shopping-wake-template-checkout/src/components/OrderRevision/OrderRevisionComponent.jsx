import Eitri from 'eitri-bifrost'
import { useCheckout } from '../../providers/UseCheckout'
import { PAYMENT_METHODS_ICONS } from '../../utils/Constants'
import Card from './component/Card'
import thunderIcon from './../../assets/images/thunderIcon.svg'
import locationIcon from './../../assets/images/locationIcon.svg'

export default function OrderRevisionComponent(props) {
	const { getOrderRevision } = useCheckout()

	const [orderRevision, setOrderRevision] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		getOrderRevision().then(revision => {
			setOrderRevision(revision)
			setLoading(false)
		})
	}, [])

	const navigateTo = route => {
		Eitri.navigation.navigate({ path: route, replace: true })
	}

	return (
		<View className='flex flex-col gap-4 py-4'>
			{loading ? (
				<View className='flex w-screen justify-center'>
					<Loading />
				</View>
			) : (
				<>
					{orderRevision?.payment && (
						<Card
							title={orderRevision?.payment?.title}
							subtitle={orderRevision?.payment?.subtitle}
							onClick={_ => navigateTo('Payment')}
						/>
					)}

					{orderRevision?.freight?.map(freightOption => (
						
						<Card
							title={`${freightOption.isPickup ? 'Retirada - ' : 'Entrega - '} ${freightOption?.title}`}
							subtitle={freightOption?.subtitle}
							onClick={_ => navigateTo('SelectFreight')}
						>
							{freightOption.isDelivery ?( 
								<View className='flex flex-col'>
									<Text className='text-xs text-gray-600'>
										Destinatário: {freightOption.address.title}
									</Text>
									<Text className='text-xs text-gray-600'>
										{freightOption.address.subtitle}
									</Text>
								</View>
							) : (
								<View className='flex flex-col'>
									<Text className='text-xs text-gray-600'>
										{freightOption.address.subtitle}
									</Text>
								</View>
							)}
						</Card>
					))}
				</>
			)}
		</View>
	)
}
