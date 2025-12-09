import { WishlistIcon } from 'shopping-wake-template-shared'
import favorite from '../assets/icons/favorite.svg'

export default function FavoriteButton(props) {
	const { actionFavorite, isFavorite } = props

	return (
		<View
			className={`absolute opacity-70 z-1000 right-2 top-2 p-2 flex items-center justify-center`}
			onClick={actionFavorite}>
			<WishlistIcon checked={isFavorite} />
		</View>
	)
}
