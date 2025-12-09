import { Wake } from 'eitri-shopping-wake-shared'
import {
	queryBasicContentByHotsiteId,
	queryBasicContentByHotsiteUrl,
	queryAllContentHotsiteByUrl,
	queryProductsByHotsite
} from '../queries/hotsite'

export const getHotsiteData = async (url, variables) => {
	const result = await Wake.graphQl.query(queryAllContentHotsiteByUrl, { url, ...variables })
	return result.hotsite
}

export const getBasicHotsiteData = async url => {
	const result = await Wake.graphQl.query(queryBasicContentByHotsiteUrl, { url })
	return result.hotsite
}

export const getBasicHotsiteDataById = async id => {
	const result = await Wake.graphQl.query(queryBasicContentByHotsiteId, { id })
	return result.hotsite
}

export const getProductsFromHotsite = async (url, variables) => {
	const result = await Wake.graphQl.query(queryProductsByHotsite, { url, ...variables })
	return result.hotsite
}

export const getSeoTitle = seo => {
	if (seo) {
		const seoTitle = seo.find(s => s.type.toLowerCase() === 'title')
		if (seoTitle) {
			return seoTitle.content
		}
	}
	return ''
}

export const getSeoHotsiteUrl = seo => {
	if (seo) {
		const seoTitle = seo.find(s => s.type.toLowerCase() === 'hotsite')
		if (seoTitle) {
			return seoTitle.content
		}
	}
	return ''
}
