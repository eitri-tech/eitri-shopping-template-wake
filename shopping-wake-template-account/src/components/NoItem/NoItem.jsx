import imgBox from '../../assets/images/box-01.svg'

export default function NoItem(props) {
	const { title, subtitle } = props

	return (
		<View className='flex flex-col items-center justify-center p-4'>
			<Image
				src={imgBox}
				width={24}
				height={24}
			/>

			<Text className='text-center font-medium mt-2'>{title}</Text>
			<Text className='text-center font-medium'>{subtitle}</Text>
		</View>
	)
}
