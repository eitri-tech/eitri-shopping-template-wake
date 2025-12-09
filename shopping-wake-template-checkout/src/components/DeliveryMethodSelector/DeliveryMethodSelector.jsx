import { useCheckout } from '../../providers/UseCheckout'
import Eitri from 'eitri-bifrost'
import BottomFixed from '../BottomFixed/BottomFixed'
import ShippingMethodCard from '../ShippingMethodCard/ShippingMethodCard'
import { CustomButton } from 'shopping-wake-template-shared'
import PickUpMethodCard from '../PickUpMethodCard/PickUpMethodCard'
import { sendLogError } from '../../services/TrackingService'

export default function DeliveryMethodSelector(props) {
	const { className, ...rest } = props
	const { customer, getShippingQuotes, setDeliveryOption, checkout } = useCheckout()

	const DELIVERY_TYPE = 'delivery_type'
	const PICKUP_TYPE = 'pickup_type'

	const [shippingMethods, setShippingMethods] = useState([])
	const [selectedShippingMethod, setSelectedShippingMethod] = useState(null)
	const [loadingDeliveryOption, setLoadingDeliveryOption] = useState(false)
	const [loadingQuotes, setLoadingQuotes] = useState(true)
	const [shippingTypeFilter, setShippingTypeFilter] = useState(DELIVERY_TYPE)

	useEffect(() => {
		getShippingQuotes().then(_shippingMethods => {
			const selectedMethod = _shippingMethods.find(method => method.isCurrent)
			if (selectedMethod) {
				setSelectedShippingMethod({ ...selectedMethod })
				setShippingTypeFilter(selectedMethod.isPickup ? PICKUP_TYPE : DELIVERY_TYPE)
			} else {
				setShippingTypeFilter(_shippingMethods.some(m => !m.isPickup) ? DELIVERY_TYPE : PICKUP_TYPE)
			}
			setShippingMethods(_shippingMethods)
			setLoadingQuotes(false)
		})
	}, [customer])

	const handleShippingMethodSelection = async () => {
		try {
			setLoadingDeliveryOption(true)
			await setDeliveryOption(selectedShippingMethod.id)
			Eitri.navigation.navigate({ path: 'Payment' })
			setLoadingDeliveryOption(false)
		} catch (e) {
			setLoadingDeliveryOption(false)
			sendLogError(e, '[DeliveryMethodSelector]handleShippingMethodSelection', {
				userEmail: customer?.email,
				cartId: checkout?.checkoutId
			})
		}
	}

	const deliveryShippingMethods = shippingMethods.filter(method => !method.isPickup)
	const pickupShippingMethods = shippingMethods.filter(method => method.isPickup)

	return (
		<View className={`flex flex-col gap-4 ${className || ''}`}>
			<View>
				<Text className='text-base font-medium block'>Escolha o método de entrega</Text>
				<Text className='mt-1 text-xs text-gray-600'>
					Confira nossos prazos e taxas para escolher o método de entrega da sua preferência.
				</Text>
			</View>

			<View className='flex flex-col gap-3'>
				{loadingQuotes ? (
					<View className='flex w-screen justify-center'>
						<Loading />
					</View>
				) : (
					<>
						{shippingMethods.length === 0 ? (
							<View className='border border-yellow-300 p-4'>
								<Text className='mb-2 text-sm font-medium text-yellow-800 block'>
									Nenhuma forma de envio encontrada
								</Text>
								<Text className='text-xs text-yellow-700'>
									Não conseguimos calcular o frete para sua região. Por favor, entre em contato
									conosco para que possamos ajudar.
								</Text>
							</View>
						) : (
							<View>
								{deliveryShippingMethods.length > 0 && pickupShippingMethods.length > 0 && (
									<View className='mb-4'>
										<View className='flex justify-between w-full'>
											<View
												className='flex justify-center flex-1'
												onClick={() => setShippingTypeFilter(DELIVERY_TYPE)}>
												<Text
													className={`text-sm ${shippingTypeFilter === DELIVERY_TYPE ? 'font-semibold' : ''}`}>
													Receber
												</Text>
											</View>
											<View
												className='flex justify-center flex-1'
												onClick={() => setShippingTypeFilter(PICKUP_TYPE)}>
												<Text
													className={`text-sm ${shippingTypeFilter === PICKUP_TYPE ? 'font-semibold' : ''}`}>
													Retirar
												</Text>
											</View>
										</View>
										<View className={`relative h-[1px] w-full bg-neutral-300 mt-2`}>
											<View
												className={`absolute bottom-0 ${shippingTypeFilter === DELIVERY_TYPE ? 'left-0' : 'left-[50%]'} transition-all duration-300 bg-neutral-700 h-full w-[50%]`}
											/>
										</View>
									</View>
								)}

								<View className='flex flex-col gap-3'>
									{shippingTypeFilter === DELIVERY_TYPE && (
										<>
											{deliveryShippingMethods?.map(option => (
												<ShippingMethodCard
													key={option.id}
													isSelectable
													isSelected={selectedShippingMethod?.id === option.id}
													onSelect={() =>
														setSelectedShippingMethod({ ...option, selected: true })
													}
													title={option.name}
													subTitle={option.deliveryMessage}
													description={option.formatedValue}
												/>
											))}
										</>
									)}

									{shippingTypeFilter === PICKUP_TYPE && (
										<>
											{pickupShippingMethods?.map(option => (
												<PickUpMethodCard
													key={option.id}
													isSelectable
													isSelected={selectedShippingMethod?.id === option.id}
													onSelect={() =>
														setSelectedShippingMethod({ ...option, selected: true })
													}
													title={option.name}
													subTitle={option.deliveryMessage}
													description={option.formatedValue}
													pickUpStore={option.pickUpStore}
												/>
											))}
										</>
									)}
								</View>
							</View>
						)}
					</>
				)}
			</View>

			<BottomFixed>
				<CustomButton
					loading={loadingDeliveryOption}
					disabled={!selectedShippingMethod}
					onClick={handleShippingMethodSelection}
					label='Continuar'
				/>
			</BottomFixed>
		</View>
	)
}
