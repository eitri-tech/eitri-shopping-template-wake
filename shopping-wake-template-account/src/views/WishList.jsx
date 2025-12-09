import Eitri from 'eitri-bifrost'
import { View } from 'eitri-luminus'
import { HeaderContentWrapper, HeaderReturn, LoadingComponent } from 'shopping-wake-template-shared'
import favorite from '../assets/images/favorite-1.svg'
import HeaderTemplate from '../components/Shared/HeaderTemplate/HeaderTemplate'
import { addToWishlist, getWishlist, removeFromWishlist } from '../services/CustomerService'
import WishListItem from '../components/WishListItem'
import { openProduct } from '../services/NavigationService'
import { logScreenView } from '../services/TrackingService'

export default function WishList() {
	const PAGE = 'Lista de desejos'
	const [wishlistItems, setWishlistItems] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		start()
		logScreenView(PAGE)
	}, [])

	const start = async () => {
		try {
			setIsLoading(true)
			const result = await getWishlist()
			if (result) {
				setWishlistItems(result)
			}
		} catch (e) {
			console.error('Erro obtendo wishlist', e)
		} finally {
			setIsLoading(false)
		}
	}

	const onRemoveFromWishList = async productId => {
		try {
			await removeFromWishlist(productId)
		} catch (error) {
			console.error('onRemoveFromWishList Error', productId, e)
		}
	}

	const onAddToWishList = async productId => {
		try {
			await addToWishlist(productId)
		} catch (error) {
			console.error('onAddToWishList Error', productId, e)
		}
	}

	const navigateToProduct = async productId => {
		await openProduct(productId, PAGE)
	}

	const backToPage = () => {
		Eitri.navigation.back()
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<View className='flex flex-row justify-start items-center gap-4'>
					<HeaderReturn onClick={backToPage} />
					<Text className=''>{PAGE}</Text>
				</View>
			</HeaderContentWrapper>

			<LoadingComponent
				isLoading={isLoading}
				fullScreen
			/>

			{wishlistItems && wishlistItems.length > 0 && (
				<View className='flex flex-col gap-2 w-full px-4'>
					<View
						style={{
							display: 'grid',
							gridTemplateColumns: `repeat(2, 1fr)`,
							columnGap: '1rem', // equivalente a gap-x-2
							rowGap: '1rem' // equivalente a gap-y-2
						}}>
						{wishlistItems.map(product => (
							<WishListItem
								product={product}
								key={product.productId}
								removeFavorite={() => onRemoveFromWishList(product.productId)}
								addFavorite={() => onAddToWishList(product.productId)}
								navigateToProduct={() => navigateToProduct(product.productId)}
							/>
						))}
					</View>
				</View>
			)}

			{(!wishlistItems || wishlistItems.length === 0) && (
				<View className='flex flex-col gap-12 p-4 justify-center items-center mt-12'>
					<Image
						src={favorite}
						width={'56px'}
					/>

					<View className='flex flex-col gap-4 p-4 justify-center items-center'>
						<Text className='text-sm font-bold text-center'>Você ainda não tem itens favoritos.</Text>
						<Text className='text-sm font-bold text-center'>
							Os produtos adicionados enquanto você navega no app aparecerão aqui.
						</Text>
					</View>
				</View>
			)}
		</Page>
	)
}
