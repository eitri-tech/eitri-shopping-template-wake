import chevronRightIcon from '../../../assets/images/chevron-right.svg'
import infoIcon from '../../../assets/images/info.svg'

export default function PaymentMethodCard(props) {
	const { title, icon, subtitle, alertMsg, onClick } = props

	return (
		<View
			className='flex flex-col gap-4'
			onClick={onClick}>
			<View className='flex items-center justify-between'>
				{/* Left Side: Icon and Title/Subtitle */}
				<View className='flex items-center gap-2'>
					{icon && (
						<View className='flex-shrink-0'>
							<Image
								src={icon}
								className='h-7 w-7'
							/>
						</View>
					)}

					<View className='flex flex-col'>
						<Text className='text-sm font-semibold'>{title}</Text>
						{subtitle && <Text className='text-xs'>{subtitle}</Text>}
					</View>
				</View>

				<View>
					<Image
						src={chevronRightIcon}
						width={20}
						height={20}
						className='text-gray-400'
					/>
				</View>
			</View>

			{/* Alert Message */}
			{alertMsg && (
				<View className='flex items-center gap-3 px-3'>
					<Image
						src={infoIcon}
						width={16}
						height={16}
						className='text-gray-600'
					/>
					<Text className='text-xs italic'>{alertMsg}</Text>
				</View>
			)}
		</View>
	)
}
