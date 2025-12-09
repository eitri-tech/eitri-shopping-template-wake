export default function HeaderFilterBar(props) {
	const {
		itemsPerRow,
		handleItemsPerRow,
		filterOptions,
		handleCategoryModal,
		showProductGrid,
		backgroundColor,
		iconColor
	} = props

	const gridOptions = [
		{ key: 'grid', rows: 4 },
		{ key: 'columns', rows: 2 },
		{ key: 'square', rows: 1 }
	]

	return (
		<View
			paddingHorizontal='large'
			paddingBottom='small'
			display='flex'
			direction='row'
			backgroundColor={backgroundColor || 'primary-900'}
			alignItems='center'
			width='100%'
			justifyContent='between'>
			{filterOptions.length > 0 ? (
				<View
					paddingHorizontal='nano'
					onClick={handleCategoryModal}>
					{/* <Icon iconKey='sliders' width={24} height={24} color={iconColor || 'neutral-100'} /> */}
				</View>
			) : (
				<View></View>
			)}
			{showProductGrid && itemsPerRow && (
				<View
					display='flex'
					direction='row'
					gap='5px'>
					{gridOptions.map(({ key, rows }) => (
						<View
							key={key}
							borderRadius='circular'
							backgroundColor={itemsPerRow === rows ? iconColor : `${backgroundColor || 'primary-100'}`}
							padding='nano'
							onClick={() => handleItemsPerRow(rows)}>
							{/* <Icon
								iconKey={key}
								width={18}
								height={18}
								color={itemsPerRow === rows ? `${backgroundColor || 'primary-100'}` : iconColor}
							/> */}
						</View>
					))}
				</View>
			)}
		</View>
	)
}
