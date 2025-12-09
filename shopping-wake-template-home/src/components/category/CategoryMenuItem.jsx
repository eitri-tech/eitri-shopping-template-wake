import { openHotsite } from '../../services/NavigationService'
import { Image } from 'eitri-luminus'
import chevronRightIcon from '../../assets/images/chevron-right.svg'
import chevronDownIcon from '../../assets/images/chevron-down.svg'
import chevronUpIcon from '../../assets/images/chevron-up.svg'

export default function CategoryMenuItem(props) {
	const { categoryData, color, index } = props
	const [showItems, setShowItems] = useState(false)

	const goToHotsite = (url, title) => {
		if (url) {
			openHotsite(url, title, {})
			return
		}

		openSubcategory()
	}

	const openSubcategory = () => {
		setShowItems(!showItems)
	}

	return (
		<View key={categoryData.menuId}>
			{(categoryData?.submenus?.length > 0 || categoryData.link) && (
				<View
					paddingVertical='display'
					marginHorizontal='display'
					borderBottomWidth='hairline'
					borderColor='neutral-500'
					flexWrap='wrap'
					direction='row'>
					<View
						onClick={() => {
							categoryData.submenus?.length > 0
								? openSubcategory(`items_${categoryData.menuId}`)
								: goToHotsite(categoryData.link, categoryData.name)
						}}
						direction='row'
						width='100vw'
						justifyContent='between'
						alignItems='center'>
						<View
							onClick={() => goToHotsite(categoryData.link, categoryData.name)}
							direction='row'>
							<Text
								marginRight='small'
								color={color || 'accent-100'}
								fontSize='large'
								textTransform='uppercase'>
								{categoryData.name}
							</Text>
							{categoryData.link && categoryData.submenus?.length === 0 && (
								<Image
									src={chevronRightIcon}
									width={24}
									height={24}
									className={`text-${color || 'accent-100'}`}
								/>
							)}
						</View>

						{categoryData.submenus?.length > 0 && (
							<View>
								<View
									paddingLeft='small'
									fontWeight='bold'>
									<Image
										src={showItems ? chevronUpIcon : chevronDownIcon}
										width={24}
										height={24}
										className={`text-${color || 'accent-100'}`}
									/>
								</View>
							</View>
						)}
					</View>

					{categoryData.submenus?.length > 0 && (
						<View
							display={showItems ? 'block' : 'none'}
							width='100vw'
							paddingTop='small'>
							{categoryData.submenus.map(category => (
								<View
									width='100%'
									paddingLeft='large'
									paddingVertical='small'
									key={`${categoryData.name}_${category.name}`}>
									<View
										onClick={() => goToHotsite(category.link, category.name)}
										direction='row'
										alignItems='center'>
										<Text
											fontSize='small'
											color={color || 'accent-100'}
											textTransform='uppercase'
											paddingRight='nano'>
											{category.name}
										</Text>
									</View>
								</View>
							))}
						</View>
					)}
				</View>
			)}
		</View>
	)
}
