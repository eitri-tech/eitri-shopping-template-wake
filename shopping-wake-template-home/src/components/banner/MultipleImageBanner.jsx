import { applyFilterContent, convertExtraParams } from '../../utils/Util'
import { View, Text } from 'eitri-luminus'
import CategoryGrid from './CategoryGrid'
import CategoryList from './CategoryList'
import SimpleBanner from './SimpleBanner'
import SliderBanner from './SliderBanner'
import SliderBannerCategory from './SliderBannerCategory'
import SliderBannerFullScreen from './SliderBannerFullScreen'

export default function MultipleImageBanner(props) {
	let { data, ...content } = props

	const mode = content.mode

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

	// SliderBannerFullScreen
	// SimpleBanner
	// SliderProductList
	// SliderBanner

	if (mode === 'SliderHero') {
		return (
			<SimpleBanner
				data={data}
				{...content}
			/>
		)
	}

	if (mode === 'FullScreen') {
		return (
			<SliderBannerFullScreen
				data={data}
				{...content}
			/>
		)
	}

	if (mode === 'BannerList') {
		return (
			<SliderBanner
				data={data}
				{...content}
			/>
		)
	}

	if (mode === 'SliderBannerCategory') {
		return (
			<SliderBannerCategory
				data={data}
				{...content}
			/>
		)
	}

	if (mode === 'CategoryGrid') {
		return (
			<CategoryGrid
				data={data}
				{...content}
			/>
		)
	}

	if (mode === 'CategoryList') {
		return (
			<CategoryList
				data={data}
				{...content}
			/>
		)
	}

	return (
		<SimpleBanner
			data={data}
			{...content}
		/>
	)
}
