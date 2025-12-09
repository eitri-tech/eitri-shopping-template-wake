import Eitri from 'eitri-bifrost'
import { ACTION_TYPE, INFO_TYPE } from '../../utils/Constants'
import { formatCurrency, formatImageUrl } from '../../utils/Util'
import { View, Carousel, Text } from 'eitri-luminus'
import { CustomCarousel } from 'shopping-wake-template-shared'

/*
	Recebe uma lista de produtos
**/
export default function SliderProducts(props) {
	const { data, keyProduct, params, seo } = props

	const products = data
	if (!products || products.length === 0) {
		return null
	}

	const [currentSlide, setCurrentSlide] = useState(0)

	const onPress = index => {
		// implementar descoberta do path, e redirecionar corretamente
		// if (pathBanner) {
		// }
	}

	const onChangeSlide = index => {
		setCurrentSlide(index)
	}

	return (
		<View
			key={`SliderProducts${keyProduct}`}
			className='snap-start relative relative pt-1 pb-1'>
			<CustomCarousel
				onSlideChange={onChangeSlide}
				autoPlay={params?.autoPlay ?? true}
				interval={params?.autoPlaySpeed || 4000}
				loop={true}>
				{products &&
					products.map((slider, idx) => (
						<View
							key={`bp_${slider.productVariantId}`}
							onClick={() => onPress(idx)}
							className='flex flex-row'>
							<Image
								src={formatImageUrl(slider.images[0].url)}
								className='bg-neutral-100'
								style={{
									height: params.height || '400px',
									width: params.width || '200px'
								}}
							/>
						</View>
					))}
			</CustomCarousel>
		</View>
	)
}
