export default function CustomInput(props) {
	const {
		label,
		icon,
		mask,
		type,
		colorLine,
		placeHolder,
		backgroundColorError,
		errorMessage,
		hasError,
		onBlur,
		...rest
	} = props

	const [pristine, setPristine] = useState(true)

	const _onBlur = () => {
		setPristine(false)
		if (onBlur) {
			onBlur()
		}
	}

	return (
		<View>
			<Text
				marginLeft='quark'
				marginBottom='quark'
				color='primary-500'
				fontSize='extra-small'>
				{label}
			</Text>
			<View
				borderColor={colorLine || 'neutral-300'}
				backgroundColor={backgroundColorError}
				borderBottomWidth='hairline'
				height='32px'
				display='flex'
				alignItems='center'
				color='neutral-500'
				paddingHorizontal='nano'>
				{icon && (
					<View>
						<Image src={icon} />
					</View>
				)}
				{/*{mask ? (*/}
				{/*	<MaskedInput borderHidden={true} mask={mask} onBlur={_onBlur} {...rest} />*/}
				{/*) : (*/}
				{/*	<Input placeholder={placeHolder} borderHidden={true} onBlur={_onBlur} type={type || 'text'} {...rest}  />*/}
				{/*)}*/}
			</View>
			{!pristine && hasError && (
				<View position='absolute'>
					<Text
						color='negative-700'
						fontSize='nano'>
						{errorMessage || '*Campo inválido'}
					</Text>
				</View>
			)}
		</View>
	)
}
