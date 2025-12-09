import { CustomInput } from 'shopping-wake-template-shared'

export default function CustomDropdown(props) {
	const { backgroundColor, width, height, alignItems, options, value, label, onChange, ...rest } = props

	const [showDropdown, setShowDropdown] = useState(false)
	const [internalValue, setInternalValue] = useState('')

	useEffect(() => {
		const selectedOption = options.find(option => option.value === value)
		setInternalValue(selectedOption?.label || selectedOption?.value)
	}, [value])

	const handleOptionSelect = option => {
		setInternalValue(option.label || option.value)
		setShowDropdown(false)
		onChange(option.value)
	}

	return (
		<View>
			{label && (
				<Text
					marginLeft='quark'
					marginBottom='quark'
					color='primary-500'
					fontSize='extra-small'>
					{label}
				</Text>
			)}
			<View
				backgroundColor={backgroundColor || 'background-color'}
				borderColor='neutral-300'
				borderBottomWidth='hairline'
				height={height || '48px'}
				display='flex'
				alignItems={alignItems || 'end'}
				color='neutral-500'
				position='relative'
				width={width || '100%'}>
				<View
					position='absolute'
					right={0}
					bottom={8}>
					{/* <Icon
						iconKey={showDropdown ? 'chevron-up' : 'chevron-down'}
						height={20}
						width={20}
					/> */}
				</View>
				<View position='relative'>
					<CustomInput
						borderHidden={true}
						marginBottom='none'
						paddingBottom='none'
						value={internalValue}
					/>
					<View
						onClick={() => setShowDropdown(!showDropdown)}
						position='absolute'
						top={0}
						left={0}
						bottom={0}
						right={0}
					/>
				</View>
				{showDropdown && (
					<>
						<View
							onClick={() => setShowDropdown(false)}
							position='fixed'
							top={0}
							left={0}
							bottom={0}
							right={0}
							backgroundColor='transparent'
							zIndex={990}
						/>
						<View
							display='flex'
							position='absolute'
							top={0}
							zIndex={999}
							width='100%'
							backgroundColor='background-color'
							padding='small'
							direction='column'
							gap={12}
							borderRadius='small'
							maxHeight='200px'
							overflowY='auto'
							borderWidth={'hairline'}>
							{options.map((option, index) => (
								<View
									key={option.value}
									onClick={() => handleOptionSelect(option)}>
									<Text
										key={index}
										fontWeight='bold'
										fontSize='small'>
										{option.label}
									</Text>
								</View>
							))}
						</View>
					</>
				)}
			</View>
		</View>
	)
}
