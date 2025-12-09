export default function PickUpMethodCard(props) {
	const { title, subTitle, description, isSelectable, onSelect, isSelected, pickUpStore, ...rest } = props

	const setMethod = () => {
		if (isSelectable) {
			onSelect()
		}
	}

	const Radio = ({ checked }) => (
		<View
			className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
				checked ? 'border-primary-500' : 'border-gray-300'
			}`}>
			{checked && <View className='h-3 w-3 rounded-full bg-meteorite-01' />}
		</View>
	)

	const formattedAddress = `${pickUpStore?.address}, ${pickUpStore?.addressNumber}${pickUpStore?.addressDetails ? ` - ${pickUpStore?.addressDetails}` : ''}`

	return (
		<View
			onClick={setMethod}
			className={`cursor-pointer border p-4 transition-all border-gray-200`}
			{...rest}>
			<View className='flex items-start justify-between gap-4'>
				{/* Left side: Title and Subtitle */}
				<View className='flex-grow'>
					<Text className='text-sm font-medium text-primary-100 block'>{title}</Text>
					<Text className='text-xs text-primary-500 block'>{formattedAddress}</Text>
					<Text className='text-xs text-primary-500 block'>{`${pickUpStore?.neighborhood} - ${pickUpStore?.city} - ${pickUpStore?.state}`}</Text>
					<Text className='text-xs text-primary-500 block'>{`${pickUpStore?.additionalText}`}</Text>
				</View>

				{/* Right side: Price and Radio button */}
				<View className='flex items-center gap-4'>{isSelectable && <Radio checked={isSelected} />}</View>
			</View>
		</View>
	)
}
