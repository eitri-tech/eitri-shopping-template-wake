import { LoadingComponent } from 'shopping-wake-template-shared'
import ProductCard from '../productCard/ProductCard'
import { logEvent } from '../../services/TrackingService'
import { Image } from 'eitri-luminus'
import CustomModal from '../CustomModal/CustomModal'
import chevronRightIcon from '../../assets/images/chevron-right.svg'
import searchIcon from '../../assets/images/search.svg'

export default function SearchResultsWrapper(props) {
	const { searchResults, isLoading, itemsPerRow, isPristine, productsBestResults, search, withOutBestResults } = props

	const [showVariations, setShowVariations] = useState(false)

	const searchAll = async term => {
		if (term) {
			await search(term)
		}
	}

	if (searchResults.length === 0 && !isLoading && !isPristine) {
		return (
			<View
				className='flex flex-col justify-center items-center'
				height='80vh'>
				<View
					className='flex justify-center items-center rounded-full bg-black-500 mb-4'
					width='50px'
					height='50px'>
					<Image
						className='text-white-500'
						src={searchIcon}
						width={30}
						height={30}
					/>
				</View>

				<Text className='font-sm text-center mb-4'>Não encontramos peças para essa busca</Text>
				<Text className='font-xs text-center'>
					Tente de novo com outras palavras-chave ou descubra nossas sugestões para você.
				</Text>
			</View>
		)
	}

	const openVariations = product => {
		setShowVariations(!showVariations)
	}

	return (
		<View className='flex flex-col gap-1 w-full px-4'>
			{searchResults.length > 0 && (
				<View
					style={{
						display: 'grid',
						gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
						columnGap: '1rem', // equivalente a gap-x-2
						rowGap: '1rem' // equivalente a gap-y-2
					}}>
					{searchResults.map((product, index) => (
						<View key={`product${product.productId}`}>
							<ProductCard
								product={product}
								width={'100%'}
								showProductInfo={true}
								showFavoriteIcon={itemsPerRow < 4}
								onlyImage={Number(itemsPerRow) === 4}
								openVariationsModal={() => openVariations(product)}
							/>
						</View>
					))}
				</View>
			)}

			{/* Variações Modal */}

			{isLoading && (
				<View className='flex flex-col justify-center items-center'>
					<LoadingComponent />
				</View>
			)}
		</View>
	)
}
