export default function HeaderText(props) {
	const { text, color } = props
	return (
		<View
			width='fit-content'
			display='flex'
			justifyContent='center'
			alignItems='center'>
			<Text
				color={color || 'primary-700'}
				fontSize='large'
				textAlign='center'
				lineClamp='1'
				whiteSpace='nowrap'>
				{text}
			</Text>
		</View>
	)
}
