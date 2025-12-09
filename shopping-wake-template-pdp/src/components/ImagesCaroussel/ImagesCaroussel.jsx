import { formatImageUrl } from '../../utils/Util'
import { CustomCarousel } from 'shopping-wake-template-shared'

export default function ImagesCaroussel(props) {
	const { product } = props

	const [currentSlide, setCurrentSlide] = useState(0)

	const onChange = index => {
		setCurrentSlide(index)
	}

	const images = product?.images?.filter((_, index) => index !== 1)

	return (
		<View className='relative'>
			<CustomCarousel onSlideChange={onChange}>
				{images?.map((item, index) => {
					return (
						<Image
							key={item.url}
							src={formatImageUrl(item.url)}
							className={'w-full'}
						/>
					)
				})}
			</CustomCarousel>

			<View className='h-[4px] w-full bg-meteorite-04 absolute bottom-0'>
				<View
					className='h-full bg-meteorite-01 transition-[width,background-color] duration-300 ease-in-out'
					height='100%'
					width={`${((currentSlide + 1) / images?.length) * 100}%`}
				/>
			</View>
		</View>
	)
}
