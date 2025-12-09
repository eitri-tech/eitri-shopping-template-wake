import { useState, useEffect, useRef } from 'react'
import { View, Image, Text } from 'eitri-luminus'
import { CustomCarousel } from 'shopping-wake-template-shared'
import { calculeBestDimensions, consvertSize, computeBannerHeightVW, formatImageUrl } from '../../utils/Util'
import { openHotsite, openHotsiteOrProduct, openProduct, openSearch } from '../../services/NavigationService'

/*
	Recebe uma lista de banners - Banner Slider Hero
**/
export default function SimpleBanner(props) {
	const { data, keyProduct, wide, seo, ...params } = props

	const banners = data
	if (!banners || banners.length === 0) {
		return null
	}

	const widthBanner = 100
	const [heightBanner, setHeightBanner] = useState(widthBanner)
	const [currentSlide, setCurrentSlide] = useState(0)
	const carouselRef = useRef(null)

	useEffect(() => {
		init()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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

	const init = async () => {
		try {
			if (!banners || !banners[0] || !banners[0].bannerUrl) return
			const imgUrl = formatImageUrl(banners[0].bannerUrl)
			const dimensions = await calculeBestDimensions(imgUrl)
			const height = computeBannerHeightVW(dimensions, widthBanner, 1)
			setHeightBanner(height)
		} catch (e) {
			console.error('init:', e)
		}
	}

	const handlePrevSlide = () => {
		if (carouselRef.current) {
			carouselRef.current.prevSlide()
		}
	}

	const handleNextSlide = () => {
		if (carouselRef.current) {
			carouselRef.current.nextSlide()
		}
	}

	const handleSlideChange = newIndex => {
		setCurrentSlide(newIndex)
	}

	const itemBanner = slider => {
		return (
			<View
				key={slider.bannerUrl}
				className='flex items-center justify-center w-full snap-x snap-always'
				onClick={() => onPress(slider)}>
				<Image
					className='w-full h-full object-cover'
					fadeIn={1000}
					src={formatImageUrl(slider.bannerUrl)}
				/>

				{params?.striped && slider.title && (
					<View className='flex flex-col justify-end items-center w-full mb-8'>
						<Text className='text-neutral-100 tracking-wide font-bold text-lg uppercase'>
							{slider.title}
						</Text>
					</View>
				)}
			</View>
		)
	}

	return (
		<View
			key={`SimpleBanner${keyProduct}`}
			className={`snap-start relative flex justify-center
				mb-${consvertSize(params?.marginBottom || 'none')} 
				mb-${consvertSize(params?.marginTop || 'none')}`}
			width={`${widthBanner}vw`}
			height={`${heightBanner}vw`}>
			{banners?.length > 1 ? (
				<>
					<CustomCarousel
						ref={carouselRef}
						autoPlay={params?.autoPlay ?? true}
						interval={params?.autoPlaySpeed || 5000}
						loop={true}
						onSlideChange={handleSlideChange}>
						{banners.map((slider, idx) => itemBanner(slider))}
					</CustomCarousel>

					{/* Seta Esquerda */}
					<View
						className='absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 transition-all duration-200'
						onClick={handlePrevSlide}
						role='button'
						tabIndex={0}
						aria-label='Slide anterior'>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							className='text-white'>
							<path
								d='M18 22L6 12L18 2'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>

					{/* Seta Direita */}
					<View
						className='absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-2 transition-all duration-200'
						onClick={handleNextSlide}
						role='button'
						tabIndex={0}
						aria-label='Próximo slide'>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							className='text-white'>
							<path
								d='M6 2L18 12L6 22'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>
				</>
			) : (
				itemBanner(banners[0])
			)}
		</View>
	)
}
