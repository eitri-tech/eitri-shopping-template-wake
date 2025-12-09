export default function UserOptionCard(props) {
	const { onClick, iconKey, label } = props

	return (
		<View
			direction='row'
			justifyContent='between'
			alignItems='center'
			elevation='low'
			padding='nano'
			onClick={onClick}>
			<View
				direction='row'
				gap={6}
				alignItems='center'>
				<View padding='nano'>
					{/* <Icon
						iconKey={iconKey}
						color='primary-500'
						width={20}
						height={20}
					/> */}
				</View>
				<Text>{label}</Text>
			</View>

			{/* <Icon
				iconKey='chevron-right'
				color='primary-500'
				width={16}
				height={16}
			/> */}
		</View>
	)
}
