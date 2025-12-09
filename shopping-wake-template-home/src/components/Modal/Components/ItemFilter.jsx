import chevronDown from '../../../assets/images/chevron-down.svg'
import chevronUp from '../../../assets/images/chevron-up.svg'

export default function ItemFilter(props) {
	const { variation, tabIndex, activeTabItem, setActiveTabItem, onSelectVariation, selectedFilters } = props

	const [showVariations, setShowVariations] = useState(false)

	useEffect(() => {
		if (activeTabItem !== tabIndex) {
			setShowVariations(false)
		} else {
			setShowVariations(true)
		}
	}, [activeTabItem])

	const toggleTabItems = () => {
		if (showVariations) {
			setActiveTabItem(null)
		} else {
			setActiveTabItem(tabIndex)
		}
	}

	const isSelected = value => {
		return selectedFilters.some(item => item === `${variation.field}/${value}`)
	}

	return (
		<View key={`variation_${variation.field}`}>
			<View
				className='flex flex-row gap-2 justify-between'
				onClick={toggleTabItems}>
				<Text className='text-xs'>{variation.field}</Text>
				<View className='flex p-1 items-center justify-center'>
					<Image
						src={showVariations ? chevronUp : chevronDown}
						width={12}
						height={12}
					/>
				</View>
			</View>

			<View
				className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${showVariations ? 'max-h-40 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}
                    flex flex-row flex-wrap mx-4 justify-start
                `}>
				{variation.values.map((value, index) => (
					<View
						key={`${variation.field}_${value.name}`}
						onClick={() => onSelectVariation(variation.field, value)}
						className='flex flex-row py-2 px-4 items-center justify-center'>
						<Text className={`text-xs ${isSelected(value.name) ? 'font-bold underline' : ''}`}>
							{value.name}
						</Text>
					</View>
				))}
			</View>
		</View>
	)
}
