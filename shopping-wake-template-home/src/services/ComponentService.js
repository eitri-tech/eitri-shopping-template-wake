import SliderProductFullScreen from '../components/banner/SliderProductFullScreen'
import SliderBannerFullScreen from '../components/banner/SliderBannerFullScreen'
import SliderProductList from '../components/banner/SliderProductList'
import TextContent from '../components/content/TextContent'
import SliderBanner from '../components/banner/SliderBanner'
import SliderProducts from '../components/banner/SliderProducts'
import { View } from 'eitri-luminus'
import SimpleBanner from '../components/banner/SimpleBanner'
import { INFO_TYPE } from '../utils/Constants'
import MultipleExternalImageBanner from 'src/components/banner/MultipleExternalImageBanner'
import MultipleImageBanner from '../components/banner/MultipleImageBanner'
import ProductShelf from '../components/product/ProductShelf'
import CategoryGrid from '../components/banner/CategoryGrid'
import SliderBannerCategory from '../components/banner/SliderBannerCategory'
import { logError } from './TrackingService'

export const componentMap = {
	SliderBannerFullScreen: { class: SliderBannerFullScreen, infoType: INFO_TYPE.BANNER },
	SimpleBanner: { class: SimpleBanner, infoType: INFO_TYPE.BANNER },
	SliderBanner: { class: SliderBanner, infoType: INFO_TYPE.BANNER },

	SliderProductList: { class: SliderProductList, infoType: INFO_TYPE.PRODUCTS },
	TextContent: { class: TextContent, infoType: INFO_TYPE.CONTENT },

	SliderProducts: { class: SliderProducts, infoType: INFO_TYPE.PRODUCTS },
	SliderProductFullScreen: { class: SliderProductFullScreen, infoType: INFO_TYPE.PRODUCTS },

	CategoryGrid: { class: CategoryGrid, infoType: INFO_TYPE.BANNER },
	SliderBannerCategory: { class: SliderBannerCategory, infoType: INFO_TYPE.BANNER },

	MultipleExternalImageBanner: { class: MultipleExternalImageBanner, infoType: INFO_TYPE.BANNER },
	MultipleImageBanner: { class: MultipleImageBanner, infoType: INFO_TYPE.BANNER },
	ProductShelf: { class: ProductShelf, infoType: INFO_TYPE.PRODUCTS }
}

export const getMappedComponent = (content, idx, keyProduct) => {
	// console.log('getMappedComponent Service >>>>>>>>>>>>>>>>>>>>>>', content?.component)
	// if (content?.component !== 'MultipleImageBanner') {
	// 	return null
	// }
	const Component = componentMap[content.component]?.class

	if (!Component) {
		console.error(
			`Component ${content.component || content.name} does not exist in the component map.`,
			JSON.stringify(content)
		)
		return null
	}

	const key = `${content.component}${idx}`
	// Gerar uma keyProduct única para cada componente usando o índice
	const uniqueKeyProduct = `${keyProduct}-${idx}`

	try {
		return (
			<View
				key={key}
				scrollSnapAlign='start'>
				<Component
					keyProduct={uniqueKeyProduct}
					{...content}
				/>
			</View>
		)
	} catch (error) {
		logError('getMappedComponent', error)
		console.error(`Error rendering component ${content.name}:`, error)
		return <View />
	}
}

export const loadHeaderHeight = async () => {
	await waitForElement('#header')
	const element = document.getElementById('header')
	if (element) {
		const headerHeight = element.offsetHeight
		return headerHeight
	}
	return 0
}

export const waitForElement = selector => {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector))
		}

		const observer = new MutationObserver(mutations => {
			if (document.querySelector(selector)) {
				observer.disconnect()
				resolve(document.querySelector(selector))
			}
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true
		})
	})
}
