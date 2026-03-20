import Eitri from 'eitri-bifrost'
import { CustomButton } from 'shopping-wake-template-shared'
import { useCheckout } from '../../providers/UseCheckout'
import BottomFixed from '../BottomFixed/BottomFixed'
import ShippingMethodCard from '../ShippingMethodCard/ShippingMethodCard'
import PickUpMethodCard from '../PickUpMethodCard/PickUpMethodCard'
import { sendLogError } from '../../services/TrackingService'
import LineProduct from '../OrderSummary/LineProduct'

export default function DeliveryMethodSelector(props) {
	const { className, ...rest } = props
	const { customer, getShippingQuotes, setDeliveryOption, getTotalizers, checkout } = useCheckout()

	const DELIVERY_TYPE = 'delivery_type'
	const PICKUP_TYPE = 'pickup_type'

	const [shippingMethods, setShippingMethods] = useState([])
	const [deliveryShippingMethods, setDeliveryShippingMethods] = useState([])
	const [pickupShippingMethods, setPickupShippingMethods] = useState([])
	const [selectedShippingMethod, setSelectedShippingMethod] = useState([])
	const [loadingDeliveryOption, setLoadingDeliveryOption] = useState(false)
	const [loadingQuotes, setLoadingQuotes] = useState(true)
	const [selectedTabShipping, setSelectedTabShipping] = useState([])

	useEffect(() => {
		init()
	}, [customer])

	const init = async () => {
		let _shippingQuotes = []
		try {
			_shippingQuotes = await getShippingQuotes()
			const shippingQuotes = _shippingQuotes.map(shipping => {
				const shippingProducts = shipping.products || []
			
				const completeProducts = shippingProducts.map(product => {
					const productInfo = checkout.products.find(item => `${item.productVariantId}` === `${product.productVariantId}`)
					return productInfo
				})
	
				return {
					...shipping,
					products: completeProducts
				}
			})
			setShippingMethods(shippingQuotes)
		} catch (e) {
			console.log('getShippingQuotes: ', e)
		}

		let _selectedShippingMethod = _shippingQuotes.map(() => null)
		let _setSelectedTabShipping = _shippingQuotes.map(() => DELIVERY_TYPE)
		try {
			if (checkout?.selectedShippingGroups?.length) {
				_shippingQuotes.forEach((shipping, idx) => {
	
					if (!shipping) return
	
					const selectedDelivery = shipping?.delivery?.find(delivery =>
						checkout.selectedShippingGroups.some(selected => {
							return delivery.id === selected?.selectedShipping?.shippingQuoteId
						})
					)
					if (selectedDelivery) {
						_selectedShippingMethod[idx] = selectedDelivery
						return
					}
	
					const selectedPickup = shipping?.pickup?.find(pickup =>
						checkout.selectedShippingGroups.some(selected => {
							return  pickup.id === selected?.selectedShipping?.shippingQuoteId
						})
					)
					if (selectedPickup) {
						_selectedShippingMethod[idx] = selectedPickup
						_setSelectedTabShipping[idx] = PICKUP_TYPE
					}
				})
			}
		} catch (e) {
			console.log('selectedShippingMethod: ', e)
		}
		
		setSelectedShippingMethod(_selectedShippingMethod)
		setSelectedTabShipping(_setSelectedTabShipping)
		setLoadingQuotes(false)
	}


	const handleShippingMethodSelection = async () => {
		try {
			setLoadingDeliveryOption(true)
			for (const method of selectedShippingMethod) {
				await setDeliveryOption(method)
			}
			
			Eitri.navigation.navigate({ path: 'Payment' })
			
		} catch (e) {
			sendLogError(e, '[DeliveryMethodSelector]handleShippingMethodSelection', {
				userEmail: customer?.email,
				cartId: checkout?.checkoutId
			})
		}
		setLoadingDeliveryOption(false)
	}

	const handleSelectedShippingMethod = (index, shippingMethod) => {
		const _selectedShippingMethod = [...selectedShippingMethod]
		_selectedShippingMethod[index] = shippingMethod
		setSelectedShippingMethod(_selectedShippingMethod)
	}

	const handleSetSelectedTabShipping = (type, index) => {
		const _selectedTabShipping = [...selectedTabShipping]
		_selectedTabShipping[index] = type
		setSelectedTabShipping(_selectedTabShipping)
	}

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
					<View className={`flex flex-col gap-3`}>
						{shippingMethods?.length === 0 ? (
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
							<>
								{ shippingMethods.map( (method, idx) => (
									<View key={`method_${idx}`}
										className={`flex flex-col ${shippingMethods?.length > 1 ? 'rounded border-neutral-300' : ''}`}>
										
										{idx > 0 && <View className='h-[1px] bg-gray-300 w-full px-2' />}

										<View className='flex flex-col w-full p-4 gap-2'>
											{method.products?.map((product, idx) => (
												 <LineProduct 
													name={product.name}
													imageUrl={product.imageUrl}
												/>
											))}
										</View>

										<View className='p-2'>
											{method.delivery?.length > 0 && method.pickup?.length > 0 && (
												<View className=''>
													<View className={`flex justify-between w-full`}>
														<View
															className={`flex justify-center p-2 flex-1 ${!selectedTabShipping?.[idx] || selectedTabShipping?.[idx] === DELIVERY_TYPE ? 'border-t border-l border-r' : ''}`}
															onClick={() => handleSetSelectedTabShipping(DELIVERY_TYPE, idx)}>
															<Text
																className={`text-sm ${selectedTabShipping?.[idx] === DELIVERY_TYPE ? 'font-semibold' : ''}`}>
																Receber
															</Text>
														</View>
														<View
															className={`flex justify-center p-2 flex-1 ${selectedTabShipping?.[idx] === PICKUP_TYPE ? 'border-t border-l border-r' : ''}`}
															onClick={() => handleSetSelectedTabShipping(PICKUP_TYPE, idx)}>
															<Text
																className={`text-sm ${selectedTabShipping?.[idx] === PICKUP_TYPE ? 'font-semibold' : ''}`}>
																Retirar
															</Text>
														</View>
													</View>
												</View>
											)}

											<View className='flex flex-col'>
												{(!selectedTabShipping?.[idx] || selectedTabShipping?.[idx] === DELIVERY_TYPE) && (
													<>
														{method.delivery?.map(option => (
															<ShippingMethodCard
																key={option.id}
																isSelectable
																isSelected={selectedShippingMethod?.[idx]?.id === option.id}
																onSelect={() =>
																	handleSelectedShippingMethod(idx, option)
																}
																title={option.name}
																subTitle={option.deliveryMessage}
																description={option.formatedValue}
															/>
														))}
													</>
												)}

												{selectedTabShipping?.[idx] === PICKUP_TYPE && (
													<>
														{method.pickup?.map(option => (
															<PickUpMethodCard
																key={option.id}
																isSelectable
																isSelected={selectedShippingMethod?.[idx]?.id === option.id}
																onSelect={() =>
																	handleSelectedShippingMethod(idx, option)
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
									</View>
								) )}
							</>
						)}
					</View>
				)}
			</View>

			<BottomFixed>
				<CustomButton
					loading={loadingDeliveryOption}
					disabled={!selectedShippingMethod || selectedShippingMethod?.some(i => !i)}
					onClick={handleShippingMethodSelection}
					label='Continuar'
				/>
			</BottomFixed>
		</View>
	)
}
