// Usando scroller horizontal nativo para slides colados (sem CustomCarousel aqui)
import { ACTION_TYPE, INFO_TYPE } from '../../utils/Constants'
import { calculeBestDimensions, computeBannerHeightVW, consvertSize, formatCurrency, formatImageUrl } from '../../utils/Util'
import { View, Text, Image } from 'eitri-luminus'
import { openHotsite, openHotsiteOrProduct, openProduct, openSearch } from '../../services/NavigationService'
import plusIcon from '../../assets/images/plus.svg'
import { useState, useEffect } from 'react'

/*
	Recebe uma lista de banners - Banners com Tarja
**/
export default function SliderBanner(props) {
	const { data, keyProduct, seo, ...params } = props

	const banners = data
	if (!banners || banners.length === 0) return null

	const [currentSlide, setCurrentSlide] = useState(0)
	const [loading, setLoading] = useState(true)
	const [heightBanner, setHeightBanner] = useState()

	// Exibe 1 banner completo + 1/5 de preview do próximo: itemWidth = 100 / 1.2
	const ITEM_WIDTH_VW = parseFloat((100 / 1.2).toFixed(4))

	// usa rolagem nativa para uma experiência mais fluida; sem snap programático

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
			if (banners && banners[0] && banners[0].bannerUrl) {
				const imgUrl = formatImageUrl(banners[0].bannerUrl)
				const dimensions = await calculeBestDimensions(imgUrl)
				// calcula altura em vw usando ITEM_WIDTH_VW e limita ao viewport
				const computedHeight = computeBannerHeightVW(dimensions, ITEM_WIDTH_VW, 1)
				setHeightBanner(computedHeight)
			} else {
				setHeightBanner(undefined)
			}
		} catch (e) {
			console.error('SliderBanner:', e)
			setHeightBanner(undefined)
		}
		setLoading(false)
	}

	useEffect(() => {
		init()
	}, [])

	const containerHeight = typeof heightBanner !== 'undefined' ? `${heightBanner}vw` : 'auto'

	return (
		<View
			key={`SliderBanner${keyProduct}`}
			className={`snap-start relative w-full
				mb-${consvertSize(params?.marginBottom || 'none')} 
				mb-${consvertSize(params?.marginTop || 'none')}`}
			style={{ width: '100vw', height: containerHeight }}>
			{loading ? (
				<View
					className='w-full h-full rounded-sm'
					mode='skeleton'
				/>
			) : (
				<View className='relative'>
					<View
						className='flex overflow-x-auto'
						style={{
							width: '100%',
							height: containerHeight,
							gap: 0,
							scrollSnapType: 'none',
							WebkitOverflowScrolling: 'touch',
							scrollBehavior: 'smooth',
							scrollbarWidth: 'none',
							msOverflowStyle: 'none'
						}}>
						{banners &&
							banners.map((slider, idx) => (
								<View
									key={`sb_${slider.bannerId}`}
									onClick={() => onPress(slider)}
									className={`flex flex-col justify-end`}
									style={{
										margin: 0,
										padding: 0,
										boxSizing: 'border-box',
										backgroundImage: `url(${formatImageUrl(slider.bannerUrl)})`, 
										backgroundSize: 'cover',
										backgroundRepeat: 'no-repeat',
										backgroundPosition: 'center',
										height: `${heightBanner}vw`,
										width: `${ITEM_WIDTH_VW}vw`,
										minWidth: `${ITEM_WIDTH_VW}vw`,
										flexBasis: `${ITEM_WIDTH_VW}vw`,
										marginRight: 0
									}}>
									{params?.striped && (
										<View className='relative'>
											{/* Overlay com cor e opacidade */}
											<View className='absolute inset-0 bg-primary-100 opacity-50 z-10' />

											{/* Conteúdo em cima do overlay */}
											<View
												className={`
												relative z-50 w-full flex flex-row items-center
												gap-4 p-2
												${slider.urlOnClick ? 'justify-between' : 'justify-start'}
											`}>
												<Text className='text-neutral-100 text-4xl font-light'>
													{slider.title}
												</Text>

												{slider.urlOnClick && (
													<View className='flex flex-row items-center gap-2 py-1 px-2 border border-neutral-100'>
														<Image
															src={plusIcon}
															width={24}
															height={24}
															className='text-neutral-100'
														/>
													</View>
												)}
											</View>
										</View>
									)}
								</View>
							))}
					</View>
				</View>
			)}
		</View>
	)
}
