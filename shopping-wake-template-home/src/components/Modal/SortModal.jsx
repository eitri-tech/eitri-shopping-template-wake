import { Image, View } from 'eitri-luminus'
import closeIcon from '../../assets/images/close.svg'
import ItemFilter from './Components/ItemFilter'
import { LIST_ORDERING } from '../../utils/Constants'

export default function SortModal(props) {
	const { show, onClose, currentSortType, currentSortDirection, onChange } = props

	if (!show) return null

	const applySort = value => {
		if (value.sortType === currentSortType && value.direction === currentSortDirection) return
		onChange(value.sortType, value.direction)
	}

	const isSelected = value => {
		return currentSortType === value.sortType && currentSortDirection === value.direction
	}

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
					<Text className='text font-medium pb-4'>Ordenar por</Text>
					<View className='flex flex-col gap-2 '>
						{LIST_ORDERING.values.map((item, index) => (
							<View>
								{item.visible && (
									<View
										key={`sort-modal-${item.name}`}
										className='flex flex-row p-2 items-center justify-start'
										onClick={() => applySort(item)}>
										<Text className={`text ${isSelected(item) ? 'font-bold underline' : ''}`}>
											{item.name}
										</Text>
									</View>
								)}
							</View>
						))}
					</View>
				</View>

				<View bottomInset='auto' />
			</View>
		</View>
	)
}
