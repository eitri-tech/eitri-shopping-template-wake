export default function DeliveryAddressCard(props) {
	const { order, ...rest } = props

	const deliveryAddress = order?.deliveryAddress

	const line1 = `${deliveryAddress?.street}, ${deliveryAddress?.addressNumber ?? ''}${
		deliveryAddress?.complement ? ` - ${deliveryAddress?.complement}` : ''
	}`

	const line2 = `${deliveryAddress?.city} - ${deliveryAddress?.state} - ${deliveryAddress?.neighboorhood} - ${deliveryAddress?.cep}`

	return (
		<View {...rest}>
			<Text>Endereço:</Text>

			<View className='flex flex-col mt-1'>
				<Text className='text-xs'>{line1}</Text>

				<Text className='text-xs'>{line2}</Text>
			</View>
		</View>
	)
}
