import Eitri from 'eitri-bifrost'
import { View, Carousel, Text } from 'eitri-luminus'
import { ACTION_TYPE, INFO_TYPE } from 'src/utils/Constants'
import { consvertSize, formatCurrency, formatImageUrl } from '../../utils/Util'
import { openProduct } from 'src/services/NavigationService'
import { CustomCarousel } from 'shopping-wake-template-shared'

/*
	Recebe um Produto com várias imagens
**/
export default function SliderProductFullScreen(props) {
	const { data, keyProduct, seo, ...params } = props

	const product = data
	if (!product) {
		return null
	}

	const [currentSlide, setCurrentSlide] = useState(0)

	const onPress = async () => {
		await openProduct(data.productId, data.productVariantId)
	}

	const onChangeSlide = index => {
		setCurrentSlide(index)
	}

	return (
		<View
			key={`SliderProductFullScreen${keyProduct}`}
			className={`relative snap-start mb-${consvertSize(params?.marginBottom || 'none')} mb-${consvertSize(params?.marginTop || 'none')}`}
			height={params.height ?? '100vh'}
			width={params.width ?? '100vw'}>
			<CustomCarousel
				onSlideChange={onChangeSlide}
				autoPlay={params?.autoPlay ?? true}
				interval={params?.autoPlaySpeed || 4000}
				loop={true}>
				{product.images &&
					product.images.map((slider, idx) => (
						<View
							key={`spfs_${product.productId}`}
							onClick={() => onPress()}
							direction='row'
							height={params.height ?? '100vh'}
							width={params.width ?? '100vw'}>
							<Image
								backgroundColor='neutral-100'
								grow={1}
								src={formatImageUrl(slider.url)}
								height={'100%'}
							/>
						</View>
					))}
			</CustomCarousel>

			{params.hasContent && (
				<View
					position='absolute'
					bottom={params.marginBottomContent ?? '50px'}
					width='100%'
					display='flex'
					gap='10px'
					justifyContent={params.justifyContent ?? 'center'}>
					<View
						direction='column'
						paddingLeft={params.paddingLeftContent ?? 'none'}>
						<Text
							fontSize='large'
							fontWeight='bold'>
							{product.productName}
						</Text>
						<Text
							fontSize='medium'
							fontWeight='bold'>
							{formatCurrency(product.prices.listPrice)}
						</Text>
					</View>
				</View>
			)}

			<View
				position='absolute'
				bottom='16px'
				width='100%'
				display='flex'
				gap='10px'
				justifyContent='center'>
				{product.images &&
					Array.from({ length: product.images.length }, (_, index) => (
						<View
							key={`bp_${product.productId}_${index}`}
							borderRadius='pill'
							opacity='half'
							backgroundColor={currentSlide === index ? 'neutral-900' : 'neutral-300'}
							width='32px'
							height='8px'
						/>
					))}
			</View>
		</View>
	)
}
