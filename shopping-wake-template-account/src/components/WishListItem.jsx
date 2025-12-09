import noImage from '../assets/images/no_image.png'
import { formatImageUrl } from '../utils/Util'
import FavoriteButton from './FavoriteButton'
import { View } from 'eitri-luminus'

export default function WishListItem(props) {
	const { product, navigateToProduct, removeFavorite, addFavorite } = props

	const [isFavorite, setIsFavorite] = useState(true)

	const changeProductFavorite = () => {
		if (!isFavorite) {
			setIsFavorite(true)
			addFavorite()
		} else {
			setIsFavorite(false)
			removeFavorite()
		}
	}

	return (
		<View className='relative flex flex-col snap-start flex-shrink-0 w-full border rounded-none border-gray-200 shadow-sm'>
			<View
				className='w-full h-full flex flex-col gap-1'
				onClick={navigateToProduct}>
				<View className='relative aspect-[350/449]'>
					<Image
						key={`${product.images[0].url || `noImage_${product.productName}`}`}
						loading='lazy'
						className='w-full bg-neutral-100 object-cover bg-center'
						src={product.images.length > 0 ? formatImageUrl(product.images[0].url, 400) : noImage}
					/>

					<View className='p-1 bg-background-color'>
						<Text className='text-neutral-900 line-clamp-2 break-words'>{product.productName}</Text>
					</View>
				</View>
			</View>

			<FavoriteButton
				isFavorite={isFavorite}
				actionFavorite={changeProductFavorite}
			/>
		</View>
	)
}
