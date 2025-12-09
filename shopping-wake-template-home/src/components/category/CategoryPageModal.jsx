// import { Chip, CustomButton, Spacing } from 'shopping-wake-template-shared'
import CollapsableView from './CollapsableView'
import { Image } from 'eitri-luminus'
import xIcon from '../../assets/images/x.svg'

export default function CategoryPageModal(props) {
	const {
		show,
		filterOptions,
		close,
		filter,
		listOrdering,
		orderingSelected,
		setOrderingSelected,
		filtersSelected,
		setFiltersSelected
	} = props

	const [filters, setFilters] = useState(filterOptions)

	useEffect(() => {
		window.scroll(0, 0)
	}, [])

	useEffect(() => {
		if (filterOptions) {
			setFilters(filterOptions)
		}
	}, [filterOptions])

	const selectFilter = (filter, attributes) => {
		let selectedList

		if (filtersSelected) {
			let select = filtersSelected.find(fil => fil.field === filter?.field)

			if (select) {
				const isSelected = select.values.some(atr => atr.name === attributes.name)
				select = {
					...select,
					values: isSelected ? [] : [attributes]
				}

				selectedList = filtersSelected.map(fil => (fil.field === filter?.field ? select : fil))
			} else {
				selectedList = [
					...filtersSelected,
					{ field: filter?.field, origin: filter?.origin, values: [attributes] }
				]
			}
		} else {
			selectedList = [{ field: filter?.field, origin: filter?.origin, values: [attributes] }]
		}

		selectedList = selectedList.filter(sel => sel.values.length > 0)

		setFiltersSelected(selectedList)
	}

	const isFilterSelected = (filter, atributes) => {
		let select = filtersSelected?.find(fil => fil?.field === filter)

		let selectedAtr = select?.values.find(atr => atr?.name === atributes?.name)

		return Boolean(selectedAtr)
	}

	const selectOrdering = ordering => {
		setOrderingSelected(ordering)
	}

	const clearSelectedFilters = () => {
		setOrderingSelected(listOrdering.values[0])
		setFiltersSelected([])
	}

	return (
		<Modal
			show={show}
			position={'bottom'}
			closeOnPressOut={true}
			transition='background-color 0.5s ease-in-out'
			onClose={close}>
			<View
				bottomInset
				backgroundColor='background-color'
				borderRadiusRightTop='small'
				borderRadiusLeftTop='small'
				minHeight='70vh'
				overflow='scroll'
				width='100vw'>
				<View
					onClick={close}
					display='flex'
					alignItems='center'
					justifyContent='end'
					padding='small'>
					<Image
						src={xIcon}
						width={24}
						height={24}
						className='text-neutral-900'
					/>
				</View>
				<View
					padding='small'
					display='flex'
					direction='column'>
					{listOrdering?.title && (
						<Text
							fontSize='large'
							fontWeight='bold'>
							{listOrdering?.title}
						</Text>
					)}
					{/* <Spacing height={'10px'} /> */}
					{/* <View display='flex' direction='row' flexWrap='wrap' gap='10px'>
						{listOrdering?.values &&
							listOrdering.values.map((ord, index) => (
								// <Chip
								// 	key={index}
								// 	select={() => selectOrdering(ord)}
								// 	text={ord?.name}
								// 	backgroundColor={orderingSelected?.id === ord?.id ? 'primary-900' : 'neutral-100'}
								// 	color={orderingSelected?.id === ord?.id ? 'neutral-100' : ''}
								// />
							))}
					</View> */}
				</View>
				{filters && filters?.length > 0 && (
					<View
						padding='small'
						display='flex'
						direction='column'>
						<Text
							fontSize='large'
							fontWeight='bold'>
							{'Filtrar por'}
						</Text>
						{/* <Spacing height={'10px'} /> */}
						<View>
							{filters?.map((filter, index) => (
								<CollapsableView
									key={`${filter}_${index}`}
									title={filter?.field}>
									<View
										display='flex'
										gap='10px'
										flexWrap='wrap'>
										{/* {filter?.values?.map((att, index) => {
											let isSelected = isFilterSelected(filter?.field, att)
											return (
												// <Chip
												// 	key={`${att}_${index}`}
												// 	select={() => selectFilter(filter, att)}
												// 	text={att?.name}
												// 	backgroundColor={isSelected ? 'primary-900' : 'neutral-100'}
												// 	color={isSelected && 'neutral-100'}
												// />
											)
										})} */}
									</View>
								</CollapsableView>
							))}
						</View>
					</View>
				)}
				{/* <Spacing height={'74px'} /> */}
				<View bottomInset />
				<View
					padding='small'
					width='100vw'
					backgroundColor='accent-100'
					position='fixed'
					borderTopWidth='hairline'
					borderColor='neutral-300'
					bottom={0}
					right={0}
					left={0}>
					<View
						direction='row'
						display='flex'
						justifyContent='between'>
						{/* <CustomButton
							backgroundColor='neutral-100'
							width='45vw'
							color='primary-900'
							borderRadius='none'
							label='Limpar'
							onPress={() => clearSelectedFilters()}
						/> */}
						{/* <CustomButton
							backgroundColor='primary-900'
							color='neutral-100'
							label='Ver produtos'
							width='45vw'
							borderRadius='none'
							onPress={() => filter(orderingSelected, filtersSelected)}
						/> */}
					</View>
					<View bottomInset />
				</View>
			</View>
		</Modal>
	)
}
