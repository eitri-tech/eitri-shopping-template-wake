import { logEvent } from '../../services/TrackingService'
import { applyFilterContent, convertExtraParams } from '../../utils/Util'

import CategoryGrid from './CategoryGrid'
import CategoryList from './CategoryList'
import SimpleBanner from './SimpleBanner'
import SliderBanner from './SliderBanner'
import SliderBannerCategory from './SliderBannerCategory'
import SliderBannerFullScreen from './SliderBannerFullScreen'

export default function MultipleExternalImageBanner(props) {
	let { ...content } = props

	const mode = content.mode
	// console.log('MultipleExternalImageBanner mode >>>>>>>>>>>>>>>>>>>>>>', mode)

	if (content?.extraParams?.length > 0) {
		const extraParams = convertExtraParams(content.extraParams)
		content = { ...content, ...extraParams }

		const filters = content.extraParams.filter(c => c.key.toLowerCase() === 'filter')
		if (filters?.length > 0) {
			for (const filter of filters) {
				const [field, operator, value] = filter.value.split(';')
				data = applyFilterContent(data, field, operator, value)
			}
		}
	}

	if (content.mktTag) {
		logEvent('view_promotion', {
			promotion_id: content.mktTag,
			promotion_name: content.mktTag,
			creative_name: content.mktTag
		})
	}

	// SliderBannerFullScreen
	// SimpleBanner
	// SliderProductList
	// SliderBanner

	content.images.map(item => {
		item.bannerUrl = item.imageUrl
		return item
	})

	if (mode === 'SliderHero') {
		return (
			<SimpleBanner
				data={content.images}
				{...content}
			/>
		)
	}

	// if (mode === 'RecizeToFitScreen') {
	// 	return (
	// 		<RecizeToFitScreen
	// 			data={data}
	// 			onPress={processActions}
	// 		/>
	// 	)
	// }

	if (mode === 'FullScreen') {
		return (
			<SliderBannerFullScreen
				data={content.images}
				{...content}
			/>
		)
	}

	if (mode === 'BannerList') {
		return (
			<SliderBanner
				data={content.images}
				{...content}
			/>
		)
	}

	if (mode === 'SliderBannerCategory') {
		return (
			<SliderBannerCategory
				data={content.images}
				{...content}
			/>
		)
	}

	if (mode === 'CategoryGrid') {
		return (
			<CategoryGrid
				data={content.images}
				{...content}
			/>
		)
	}

	if (mode === 'CategoryList') {
		return (
			<CategoryList
				data={content.images}
				{...content}
			/>
		)
	}

	return (
		<SimpleBanner
			data={content.images}
			{...content}
		/>
	)
}
