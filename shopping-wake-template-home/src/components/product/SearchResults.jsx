import { formatCurrency, formatImageUrl } from '../../utils/Util'
import noImage from '../../assets/images/no_image.png'
import { View } from 'eitri-luminus'

export default function SearchResults(props) {
	const { product, onPress } = props

	const [loading, setLoading] = useState(true)

	const productImage = product.images.length > 0 ? formatImageUrl(product.images[0].url) : noImage

	useEffect(() => {
		const onLoad = () => {
			const img = new Image()
			img.src = productImage
			img.onload = () => {
				setLoading(false)
			}
		}

		onLoad()
	}, [])

	return loading ? (
		<View
			mode='skeleton'
			width='100%'
			minHeight={280}
			borderRadius='small'
		/>
	) : (
		<View>
			<View
				key={`pl_${product.productId}`}
				onClick={() => onPress(product)}
				direction='row'
				width={'100%'}>
				<Image
					backgroundColor='neutral-100'
					grow={1}
					src={productImage}
					width={'100%'}
				/>
			</View>

			<View width={'100%'}>
				<Text
					marginTop='large'
					lineClamp={3}>
					{product.productName}
				</Text>
				<Text marginTop='small'>{formatCurrency(product.prices.price)}</Text>
				<Text marginTop='small'>Card de produto</Text>
			</View>
		</View>
	)
}
