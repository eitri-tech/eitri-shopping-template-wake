import { Wake } from 'eitri-shopping-wake-shared'
import {
	queryBasicContentByHotsiteId,
	queryBasicContentByHotsiteUrl,
	queryAllContentHotsiteByUrl,
	queryProductsByHotsite
} from '../queries/hotsite'

const defaultVariables = {
	first: 8,
	sortKey: 'RELEASE_DATE',
	sortDirection: 'DESC',
	filter: []
}

export const getHotsiteData = async (url, variables) => {
	const partnerAccessToken = (await Wake.store.getPartnerAccessToken()) || null
	const result = await Wake.graphQl.query(queryAllContentHotsiteByUrl, { url, partnerAccessToken, ...variables })
	return result.hotsite
}

export const getBasicHotsiteData = async (url, variables = defaultVariables) => {
	const partnerAccessToken = (await Wake.store.getPartnerAccessToken()) || null
	const result = await Wake.graphQl.query(queryBasicContentByHotsiteUrl, { url, partnerAccessToken, ...variables })
	return result.hotsite
}

export const getBasicHotsiteDataById = async (id, variables = defaultVariables) => {
	const partnerAccessToken = (await Wake.store.getPartnerAccessToken()) || null
	const result = await Wake.graphQl.query(queryBasicContentByHotsiteId, { id, partnerAccessToken, ...variables })
	return result.hotsite
}

export const getProductsFromHotsite = async (url, variables = defaultVariables) => {
	const partnerAccessToken = (await Wake.store.getPartnerAccessToken()) || null
	const result = await Wake.graphQl.query(queryProductsByHotsite, { url, partnerAccessToken, ...variables })
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
