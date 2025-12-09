import { View } from 'eitri-luminus'
import CategoryPageItem from './components/CategoryPageItem'
export default function CategoryListSwipe(props) {
	const { content, onSelect } = props

	const openItem = item => {
		onSelect(item)
	}

	return (
		<View className='flex flex-col p-4 gap-4 w-screen max-w-screen overflow-x-hidden'>
			{content &&
				content?.map(item => (
					<CategoryPageItem
						key={item.menuId}
						item={item}
						goToItem={openItem}
					/>
				))}
			<View
				bottomInset={'auto'}
				className='w-full'
			/>
		</View>
	)
}
