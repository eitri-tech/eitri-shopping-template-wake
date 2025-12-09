import { View, Text } from 'eitri-luminus'
import { openHotsite, openHotsiteOrProduct, openProduct, openSearch } from '../../services/NavigationService'
import { calculeBestDimensions, consvertSize, computeBannerHeightVW, formatImageUrl } from '../../utils/Util'
import { useState, useEffect } from 'react'

/*
	CategoryList: similar ao SliderBannerCategory, porém menor (itens menores em largura)
	- usa scroller horizontal nativo
	- exibe título opcional abaixo de cada item quando `showTitleBelow` true
*/
export default function CategoryList(props) {
	const { data, keyProduct, seo, ...params } = props

	const banners = data
	if (!banners || banners.length === 0) {
		return null
	}

	// largura do container base (vw)
	const widthBanner = 50
	// queremos itens maiores: 80% do widthBanner (por exemplo 40vw)
	const ITEM_WIDTH_VW = widthBanner * 0.8
	const GAP_VW = 1

	const [heightBanner, setHeightBanner] = useState(widthBanner)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		init()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const init = async () => {
		try {
			if (!banners[0] || !banners[0].bannerUrl) {
				setLoading(false)
				return
			}
			const imgUrl = formatImageUrl(banners[0].bannerUrl)
			const dimensions = await calculeBestDimensions(imgUrl)
			// usamos width do item para calcular altura
			const height = computeBannerHeightVW(dimensions, ITEM_WIDTH_VW, 1)
			setHeightBanner(height)
		} catch (e) {
			console.error('init:', e)
		}
		setLoading(false)
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

	const containerHeight = typeof heightBanner !== 'undefined' ? `${heightBanner}vw` : 'auto'

	return (
		<View
			key={`CategoryList${keyProduct}`}
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
						{banners.map((slider, idx) => (
							<View
								key={`cl_${slider.bannerId || idx}`}
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

								{params?.showTitleBelow && slider.title && (
									<View className='mt-2 w-full'>
										<Text className='text-neutral-900 font-medium text-sm truncate'>
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
