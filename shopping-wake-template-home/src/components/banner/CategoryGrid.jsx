import { View, Text } from 'eitri-luminus'
import { openHotsite, openHotsiteOrProduct, openProduct, openSearch } from '../../services/NavigationService'
import { calculeBestDimensions, consvertSize, computeBannerHeightVW, formatImageUrl } from '../../utils/Util'

/*
	Recebe uma lista de banners - Banner de Categoria
**/
export default function CategoryGrid(props) {
	const { data, keyProduct, seo, ...params } = props

	const banners = data
	if (!banners || banners.length === 0) {
		return null
	}

	const gap = 0
	const widthBanner = 50
	const [heightBanner, setHeightBanner] = useState(widthBanner)

	useEffect(() => {
		init()
	}, [])

	const init = async () => {
		try {
			const imgUrl = formatImageUrl(banners[0].bannerUrl)
			const dimensions = await calculeBestDimensions(imgUrl)
			const height = computeBannerHeightVW(dimensions, widthBanner, 1)
			setHeightBanner(height)
			// console.log('heightBanner >>>>>>>>>>>>>>>>>>>>>>', heightBanner, dimensions)
		} catch (e) {
			console.error('init:', e)
		}
	}

	const onPress = async slider => {
		if (slider.action) {
			if (slider.action === 'hotsite') {
				await openHotsite(slider.hotsite, slider.title, params?.searchParams)
			} else if (slider.action === 'search') {
				await openSearch(slider.term)
			} else if (slider.action === 'product') {
				await openProduct(slider.productId)
			}
		} else if (slider.urlOnClick) {
			await openHotsiteOrProduct(slider.urlOnClick, slider.title, slider.searchParams || params?.searchParams)
		}
	}

	return (
		<View
			key={`CategoryGrid${keyProduct}`}
			className={`
				snap-start relative flex flex-wrap justify-center w-full
				mb-${consvertSize(params?.marginBottom || 'none')} 
				mb-${consvertSize(params?.marginTop || 'none')}`}>
			{banners.map((slider, idx) => (
				<View
					key={slider.bannerUrl}
					style={{
						width: `${widthBanner}vw`,
						height: `${heightBanner}vw`
					}}>
					<View
						className='bg-no-repeat bg-cover bg-top border-4 shadow-sm w-full h-full'
						style={{
							backgroundImage: `url(${formatImageUrl(slider.bannerUrl)})`
						}}
						onClick={() => onPress(slider)}>
						{params?.striped && slider.title && (
							<View className='flex flex-col justify-end items-center w-full mb-8'>
								<Text className='text-neutral-100 tracking-wide font-bold text-lg uppercase'>
									{slider.title}
								</Text>
							</View>
						)}
					</View>
				</View>
			))}
		</View>
	)
}
