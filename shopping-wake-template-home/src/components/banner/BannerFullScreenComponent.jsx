import { CustomCarousel } from 'shopping-wake-template-shared'
import { calculeBestDimensions, isVideo as utilIsVideo, computeBannerHeightVW, formatImageUrl } from '../../utils/Util'
import { View, Image, Video, Text } from 'eitri-luminus'
import { openHotsite, openHotsiteOrProduct, openProduct, openSearch } from '../../services/NavigationService'
import { useState, useEffect } from 'react'

export default function BannerFullScreenComponent(props) {
	const { data, onPress: onPressProp, heightBanner: heightBannerProp, ...params } = props
	const banners = Array.isArray(data) ? data : data ? [data] : []
	const widthBanner = 100
	const [heightBanner, setHeightBanner] = useState(heightBannerProp ?? widthBanner)

	useEffect(() => {
		init()
	}, [banners, heightBannerProp])

	const onPress = async slider => {
		if (onPressProp) return onPressProp(slider)
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
			// Se o componente pai passou uma altura computada, não recompute
			if (typeof heightBannerProp !== 'undefined') {
				setHeightBanner(heightBannerProp)
				return
			}
			if (!banners || banners.length === 0 || !banners[0] || !banners[0].bannerUrl) return
			const imgUrl = formatImageUrl(banners[0].bannerUrl)
			const dimensions = await calculeBestDimensions(imgUrl)
			const computed = computeBannerHeightVW(dimensions, widthBanner, 1)
			setHeightBanner(computed)
		} catch (e) {
			console.error('init:', e)
		}
	}

	if (!banners.length) return null

	const renderBanner = slider => {
		const _isVideo = utilIsVideo(slider.bannerUrl)
		const youTubeId = slider.bannerUrl.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*)/)
		return (
			<View
				key={slider.bannerUrl}
				className='snap-start relative flex justify-center items-center bg-black w-full h-full'
				onClick={() => onPress(slider)}
				style={{ width: `${widthBanner}vw`, height: `${heightBanner}vw` }}>
				{_isVideo ? (
					<Video
						source={formatImageUrl(slider?.bannerUrl)}
						type={youTubeId ? '' : `video/${_isVideo}`}
						youTubeId={youTubeId ? youTubeId[1] : ''}
						autoPlay
						loop
						muted
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
				) : (
					<Image
						className='w-full h-full object-cover'
						fadeIn={1000}
						src={formatImageUrl(slider?.bannerUrl)}
					/>
				)}
				{/* Título opcional, se existir */}
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
			className='snap-start relative flex justify-center items-center bg-black'
			style={{ width: `${widthBanner}vw`, height: `${heightBanner}vw` }}>
			{banners.length > 1 ? (
				<CustomCarousel
					autoPlay={params?.autoPlay ?? true}
					interval={params?.autoPlaySpeed || 5000}
					loop={true}>
					{banners.map(renderBanner)}
				</CustomCarousel>
			) : (
				renderBanner(banners[0])
			)}
		</View>
	)
}
