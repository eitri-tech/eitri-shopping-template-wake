import editIcon from '../../../assets/images/edit-2.svg'

export default function Card(props) {
	const { icon, title, subtitle, onClick } = props

	return (
		<View
			onClick={onClick}
			className='flex cursor-pointer items-center justify-between px-4 gap-4'>
			{/* Left Side: Icon and Title/Subtitle */}
			<View className='flex items-center gap-4'>
				{icon && (
					<View className='flex-shrink-0'>
						<Image
							src={icon}
							className='h-8 w-8'
						/>
					</View>
				)}

				<View className='flex flex-col'>
					<Text className='text-sm font-semibold'>{title}</Text>
					{subtitle && <Text className='text-xs text-gray-600'>{subtitle}</Text>}
				</View>
			</View>

			{/* Right Side: Edit Icon */}
			<View className='min-w-[15px]'>
				<Image
					src={editIcon}
					width={15}
					height={15}
					className='text-primary-500'
				/>
			</View>
		</View>
	)
}
