import { View, Text } from 'eitri-luminus'
import { openHotsite, openHotsiteOrProduct, openProduct, openSearch } from '../../services/NavigationService'
import { calculeBestDimensions, consvertSize, computeBannerHeightVW, formatImageUrl } from '../../utils/Util'
import { useState, useEffect } from 'react'

/*
	Recebe uma lista de banners - Banner de Categoria
**/
export default function SliderBannerCategory(props) {
	const { data, keyProduct, seo, itemWidthVW, gapVW, maxViewportFactor, ...params } = props

	const banners = data
	if (!banners || banners.length === 0) {
		console.warn('SliderBannerCategory: banners inválidos', banners)
		return null
	}

	const widthBanner = 100
	const [heightBanner, setHeightBanner] = useState(widthBanner)
	const [loading, setLoading] = useState(true)

	// largura do item (mantemos mesma proporção do SliderBanner)
	// props override (se fornecido) ou defaults
	const ITEM_WIDTH_VW = typeof itemWidthVW === 'number' ? itemWidthVW : parseFloat((100 / 1.2).toFixed(4))
	// gap entre banners em vw
	const GAP_VW = typeof gapVW === 'number' ? gapVW : 2
	// fator máximo para clamp (quanto da viewport vertical o banner pode ocupar)
	const MAX_VIEWPORT_FACTOR = typeof maxViewportFactor === 'number' ? maxViewportFactor : 1

	useEffect(() => {
		// recalcula altura se o primeiro banner mudar ou se props de tamanho mudarem
		init()
	}, [ITEM_WIDTH_VW, MAX_VIEWPORT_FACTOR, data?.[0]?.bannerUrl])

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
			if (!banners || banners.length === 0 || !banners[0] || !banners[0].bannerUrl) {
				console.warn('SliderBannerCategory: banners inválidos no init', banners)
				setLoading(false)
				return
			}
			const imgUrl = formatImageUrl(banners[0].bannerUrl)
			const dimensions = await calculeBestDimensions(imgUrl)
			const height = computeBannerHeightVW(dimensions, ITEM_WIDTH_VW, MAX_VIEWPORT_FACTOR)
			setHeightBanner(height)
		} catch (e) {
			console.error('init:', e)
		}
		setLoading(false)
	}

	const containerHeight = typeof heightBanner !== 'undefined' ? `${heightBanner}vw` : 'auto'

	return (
		<View
			key={`SliderBannerCategory${keyProduct}`}
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
							gap: `${GAP_VW}vw`,
							padding: `0 ${GAP_VW}vw`,
							WebkitOverflowScrolling: 'touch'
						}}>
						{banners &&
							banners.map((slider, idx) => (
								<View
									key={`sbc_${slider.bannerId || idx}`}
									className='flex flex-col items-start'
									style={{ width: `${ITEM_WIDTH_VW}vw`, minWidth: `${ITEM_WIDTH_VW}vw` }}>
									<View
										onClick={() => onPress(slider)}
										className={`flex-shrink-0 w-full h-full bg-cover bg-no-repeat bg-center shadow-sm`}
										style={{
											backgroundImage: `url(${formatImageUrl(slider.bannerUrl)})`, 
											height: `${heightBanner}vw`
										}}
									/>

									{/* Título opcional abaixo do banner */}
									{params?.showTitleBelow && slider.title && (
										<View className='mt-2 w-full'>
											<Text className='text-neutral-900 font-semibold text-base truncate'>
												{slider.title}
											</Text>
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
