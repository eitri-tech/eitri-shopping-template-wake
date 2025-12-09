export default function ProgressScreen(props) {
	const { percentage } = props

	return (
		<View
			width='100%'
			height={1}
			backgroundColor='primary-700'>
			<View
				width={percentage ? `calc(100% - (100% - ${percentage}%))` : '100%'}
				height={1}
				backgroundColor='primary-100'></View>
		</View>
	)
}
