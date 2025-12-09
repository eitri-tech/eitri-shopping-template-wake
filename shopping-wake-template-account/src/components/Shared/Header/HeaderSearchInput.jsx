import { CustomInput } from 'shopping-wake-template-shared'

export default function HeaderSearchInput(props) {
	const { backgroundColor, contentColor, searchTerm, setSearchTerm, search } = props

	useEffect(() => {
		const inputElement = document.getElementById('input-search')
		if (inputElement) {
			inputElement.focus()
		}
	}, [])

	return (
		<View width='100%'>
			<CustomInput
				id='input-search'
				placeholder='Encontre seu produto...'
				color={contentColor}
				backgroundColor={backgroundColor}
				borderHidden={true}
				value={searchTerm}
				onChange={value => setSearchTerm(value)}
				onSubmit={value => search(value)}
			/>
		</View>
	)
}
