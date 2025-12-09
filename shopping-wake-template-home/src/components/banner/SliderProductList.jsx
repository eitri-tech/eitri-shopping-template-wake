import { View, Text, Stack } from 'eitri-luminus'
import { openHotsite, openPageError } from '../../services/NavigationService'
import { criticalWarning } from '../../services/ErrorService'
import { getSeoHotsiteUrl, getSeoTitle } from '../../services/HotsiteService'
import arrowRight from '../../assets/images/arrow_right.svg'
import { consvertSize, convertExtraParams } from '../../utils/Util'
import SliderProductItem from '../product/SliderProductItem'

/*
	Recebe uma lista de produtos
**/
export default function SliderProductList(props) {
	const { data, keyProduct, seo, extraParams, ...params } = props
	const products = data || []

	if (!products || products.length === 0) {
		return null
	}

	// Processar extraParams para extrair o título
	const extraParamsConverted = extraParams ? convertExtraParams(extraParams) : {}
	const shelfTitle = extraParamsConverted.title || params?.title

	const [loading, setLoading] = useState(false)
	const [hotsiteUrl, setHotsiteUrl] = useState('')
	const [currentSlide, setCurrentSlide] = useState(0)
	const itemsPerSlide = 2

	// Lógica para barra de paginação limitada a 5 indicadores
	const maxPaginationDots = 5
	const productsPerDot = Math.floor(products.length / maxPaginationDots)
	const actualDots = Math.min(maxPaginationDots, Math.ceil(products.length / itemsPerSlide))
	const totalSlides = Math.ceil(products.length / itemsPerSlide)

	useEffect(() => {
		const _hotsiteUrl = getSeoHotsiteUrl(seo)
		setHotsiteUrl(_hotsiteUrl)
	}, [])

	useEffect(() => {
		const container = document.querySelector(`#slider-${keyProduct}`)
		if (!container) return

		const handleScroll = () => {
			const scrollLeft = container.scrollLeft
			const productWidth = container.clientWidth * 0.7 + 8
			// Calcular qual grupo de 2 produtos estamos vendo
			const currentSlideIndex = Math.floor(scrollLeft / (productWidth * itemsPerSlide))

			// Calcular qual dot da paginação deve estar ativo baseado no progresso
			const scrollProgress = currentSlideIndex / (totalSlides - 1)
			const activeDot = Math.floor(scrollProgress * (actualDots - 1))
			setCurrentSlide(Math.min(activeDot, actualDots - 1))
		}

		container.addEventListener('scroll', handleScroll)
		return () => container.removeEventListener('scroll', handleScroll)
	}, [keyProduct, totalSlides, itemsPerSlide])

	const goToCatalog = async () => {
		await openHotsite(hotsiteUrl, params?.title)
		return
	}

	const handlePaginationClick = dotIndex => {
		setCurrentSlide(dotIndex)
		// Calcular para qual slide real devemos ir baseado no dot clicado
		const targetSlideProgress = dotIndex / (actualDots - 1)
		const targetSlide = Math.floor(targetSlideProgress * (totalSlides - 1))

		// Scrollar para o slide correspondente
		const container = document.querySelector(`#slider-${keyProduct}`)
		if (container) {
			const productWidth = container.clientWidth * 0.7 + 8 // 70vw + gap de 8px
			// Posição para o grupo de 2 produtos
			const scrollPosition = targetSlide * productWidth * itemsPerSlide
			container.scrollTo({
				left: scrollPosition,
				behavior: 'smooth'
			})
		}
	}

	try {
		return (
			<View
				key={`SliderProductList${keyProduct}`}
				className={`snap-start relative w-full p-2 flex
					mb-${consvertSize(params?.marginBottom || 'none')} 
					mb-${consvertSize(params?.marginTop || 'none')}`}>
				<View
					className={`h-full w-full ${loading ? 'block' : 'hidden'}`}
					mode='skeleton'
				/>

				<View className={`flex flex-col w-full ${loading ? 'hidden' : 'block'}`}>
					{shelfTitle && (
						<View className='spots__title--wrapper w-full mb-4'>
							<View className='w-full flex flex-row justify-between items-center'>
								<View className='flex flex-col gap-1'>
									<Text className='text-lg font-bold text-gray-800 uppercase'>{shelfTitle}</Text>
									{actualDots > 1 && (
										<View className='swiper-pagination swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal flex gap-2'>
											{[...Array(actualDots)].map((_, index) => (
												<View
													key={index}
													className={`swiper-pagination-bullet cursor-pointer ${
														currentSlide === index
															? 'swiper-pagination-bullet-active w-8 h-1.5 bg-gray-800'
															: 'w-6 h-1.5 bg-white border border-gray-800'
													}`}
													onClick={() => handlePaginationClick(index)}
													tabIndex={0}
													role='button'
													aria-label={`Go to section ${index + 1}`}
													aria-current={currentSlide === index ? 'true' : 'false'}></View>
											))}
										</View>
									)}
								</View>
								<View
									className='px-4 py-2 bg-black text-white text-xs uppercase font-bold rounded-full cursor-pointer flex-shrink-0'
									onClick={goToCatalog}>
									{params?.seeMoreLabel || 'Ver mais'}
								</View>
							</View>
						</View>
					)}

					{products && products.length > 0 && (
						<View
							id={`slider-${keyProduct}`}
							className='w-full overflow-x-auto flex flex-row gap-2 scroll-smooth'
							style={{ scrollSnapType: 'x mandatory' }}>
							{products.map((product, idx) => (
								<View
									key={`product-${idx}`}
									className='shadow-sm snap-center snap-normal flex-shrink-0'>
									<SliderProductItem
										width='70vw'
										product={product}
										showProductInfo={true}
										showFavoriteIcon={true}
									/>
								</View>
							))}
						</View>
					)}
				</View>
			</View>
		)
	} catch (e) {
		criticalWarning('SliderProductListFullScreen', e)
		return <View />
	}
}
