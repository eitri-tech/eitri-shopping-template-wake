import { Image, View } from 'eitri-luminus'
import closeIcon from '../../assets/images/close.svg'
import ItemFilter from './Components/ItemFilter'

export default function FilterModal(props) {
	const { show, onClose, filterOptions, selectedFilters, setSelectedFilters, cleanFilters } = props

	if (!show) return null

	const [activeTabItem, setActiveTabItem] = useState(null)
	const [localSelectedFilters, setLocalSelectedFilters] = useState(selectedFilters)

	const selectVariation = (field, value) => {
		const variation = `${field}/${value.name}`

		if (!localSelectedFilters || localSelectedFilters.length === 0) {
			setLocalSelectedFilters([variation])
		} else {
			const index = localSelectedFilters.findIndex(item => item === variation)
			const _localSelectedFilters = [...localSelectedFilters]
			if (index > -1) {
				_localSelectedFilters.splice(index, 1)
			} else {
				_localSelectedFilters.push(variation)
			}
			setLocalSelectedFilters(_localSelectedFilters)
		}
	}

	const applyFilters = () => {
		setSelectedFilters(localSelectedFilters)
		onClose()
	}

	const footer = params => (
		<View
			id={`${params?.id}`}
			className={`${params?.className} flex flex-col gap-2 m-4 w-auto items-center justify-center`}>
			<View
				onClick={applyFilters}
				className='bg-black w-full p-2 flex flex-row justify-center items-center'>
				<Text className='text-sm font-medium text-white'>Filtrar</Text>
			</View>
			<View
				className='p-1 flex flex-row'
				onClick={cleanFilters}>
				<Text className='text-xs underline'>Limpar Filtros</Text>
			</View>
			<View bottomInset='auto' />
		</View>
	)

	return (
		<View>
			<View
				id='background-modal-filter'
				className='z-[9000] !bg-black/70 !opacity-100 fixed inset-0 
				flex items-end justify-center overflow-hidden'
				onClick={onClose}
			/>

			<View
				id='body-modal-filter'
				className='
					fixed z-[9010] bg-white opacity-100 flex flex-col
					bottom-0 p-4 items-end justify-start
					rounded-tl-sm rounded-tr-sm overflow-y-auto'
				maxHeight={'70vh'}
				width={'100vw'}>
				<View
					onClick={onClose}
					className='absolute top-0 right-0  flex items-center justify-center p-4'>
					<Image
						src={closeIcon}
						width={16}
						height={16}
						className='text-neutral-900'
					/>
				</View>

				<View className='flex flex-col overflow-y-auto w-full'>
					<Text className='text-sm font-medium pb-4'>Filtros</Text>
					<View className='flex flex-col gap-2 '>
						{filterOptions?.map((item, index) => (
							<ItemFilter
								variation={item}
								tabIndex={index}
								activeTabItem={activeTabItem}
								setActiveTabItem={setActiveTabItem}
								onSelectVariation={selectVariation}
								selectedFilters={localSelectedFilters}
							/>
						))}
					</View>
				</View>

				{footer({
					id: 'footer-modal-filter',
					className: 'absolute bottom-0 right-0 left-0'
				})}

				{footer({
					id: 'footer-modal-filter-offset',
					className: 'invisible'
				})}
			</View>
		</View>
	)
}
