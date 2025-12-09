import { Text, View } from 'eitri-luminus'

export default function HeaderText(props) {
	const { text } = props

	return (
		<View>
			<Text className='text-header-content font-medium'>{text}</Text>
		</View>
	)
}
