import Eitri from 'eitri-bifrost'
import { INFO_TYPE } from '../utils/Constants'
import { getBasicHotsiteData } from './HotsiteService'
import { componentMap } from './ComponentService'
// import { getContentHome as getWakeContentHome } from './ContentService'
import { storeConfig } from '../configs/StoreConfig'
import { setStorageItem, setStorageJSON, STGE_ITEM } from './StorageService'
import { logError } from './TrackingService'

let responseHotsite = {}

export const getCmsHome = async () => {
	const config = await Eitri.environment.getRemoteConfigs()
	const account = config.providerInfo.account
	const cacheKey = `${account}CmsHome`

	const cachedPage = await loadPageFromCache(cacheKey)

	if (cachedPage) {
		loadHomeCmsContent().then(result => savePageInCache(cacheKey, result)).catch(e => console.error('Error saving page to cache:', e))
		return cachedPage
	}

	const page = await loadHomeCmsContent()
	savePageInCache(cacheKey, page)
	return page
}

const loadHomeCmsContent = async () => {
	const configHome = await getConfigHome()
	// console.log('configHome >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', configHome)

	try {
		// pegando informações do conteudo no projeto
		return await getContentByConfig(configHome)
	} catch (e) {
		logError('getCmsHome', e)
		console.error('Error trying get content', e)
	}

	return null
}

const loadPageFromCache = async cacheKey => {
	try {

		const CACHE_EXPIRATION_MS = 86400000 // 24 horas

		const content = await Eitri.sharedStorage.getItemJson(cacheKey)
		if (!content) return

		const inputDate = new Date(content.cachedIn)
		const currentDate = new Date()
		const differenceInMs = currentDate - inputDate
		if (differenceInMs > CACHE_EXPIRATION_MS) {
			return null
		}
		return content?.data
	} catch (error) {
		console.error('Error trying load from cache', error)
		return null
	}
}

export const savePageInCache = async (cacheKey, page) => {
	try {
		await Eitri.sharedStorage.setItemJson(cacheKey, {
			data: page,
			cachedIn: new Date().toISOString()
		})
	} catch (error) {
		console.error('Error saving page to cache:', error)
	}
}

const getConfigHome = async () => {
	// Pegar primeiro config do Eitri-content
	try {
		return await resolveCmsConfigHome()
	} catch (e) {
		console.error('getConfigHome', e)
	}

	// Fallback, config do projeto
	const config = await Eitri.environment.getRemoteConfigs()
	return storeConfig[config.providerInfo.account]
}

const resolveCmsConfigHome = async () => {
	const eitriContentHome = await getConfigByEitriContent('home')
	return eitriContentHome
}

const getContentByConfig = async configPage => {
	let contentResult = []

	for (const config of configPage) {
		// console.log('getContentByConfig >> config >>>>>>>>>>>>>', config)
		try {
			if (`${config.selfResolvedImage}` === 'true') {
				contentResult.push(config)
			} else if (config.hotsite) {
				const content = await getContentByHotsiteUrl(config.hotsite, config)
				if (content?.length > 0) contentResult = [...contentResult, ...content]
			}
		} catch (e) {
			logError('getContentByConfig', e)
			console.error('Error getWakeContentByConfig', e)
		}
	}

	return contentResult
}

const filterPosition = (elements, position) => {
	let newElements = JSON.parse(JSON.stringify(elements))
	if (position) {
		newElements = newElements
			.filter(f => f.position.toLowerCase() === position.toLowerCase())
			.sort((a, b) => a.order - b.order)
	}
	return newElements
}

const getContentByHotsiteUrl = async (hotsiteUrl, config) => {
	let result
	if (responseHotsite[hotsiteUrl.toLowerCase()]) {
		result = responseHotsite[hotsiteUrl.toLowerCase()]
	} else {
		// console.log('GET api externa >> HOTSITE WAKE >>>>>>', hotsiteUrl.toLowerCase())
		const url = hotsiteUrl.toLowerCase() === 'home' ? '' : hotsiteUrl
		result = await getBasicHotsiteData(url)
		responseHotsite[hotsiteUrl.toLowerCase()] = result
	}

	return handleContentByHotsite(result, config)
}

const handleContentByHotsite = async (result, config) => {
	let contentResult = []
	let banners = result?.banners || null
	let contents = result?.contents || null
	let products = result?.products.nodes || null
	let seo = result?.seo || []

	const componentParams = componentMap[config.component]

	if (componentParams) {
		try {
			let items = []
			if (componentParams.infoType === INFO_TYPE.BANNER && banners?.length > 0) {
				items = banners
			} else if (componentParams.infoType === INFO_TYPE.CONTENT && contents?.length > 0) {
				items = contents
			} else if (componentParams.infoType === INFO_TYPE.PRODUCTS && products?.length > 0) {
				items = products
			}

			const partContent = filterPosition(items, config.position)
			if (partContent)
				contentResult.push({
					...config,
					data: partContent,
					seo: [...seo, { type: 'hotsite', content: config.hotsite }]
				})
		} catch (e) {
			logError('handleContentByHotsite', e)
			console.error('Error handleContentByHotsite', e)
		}
	}

	return contentResult
}

const getConfigByEitriContent = async contentType => {
	const eitriConfig = await Eitri.environment.getRemoteConfigs()
	// eitriConfig.eitriContentCmsUrl = 'http://implantacao.localhost:8080/api/wake-cms-pages/?where[type][equals]=<account>'

	let result
	if (eitriConfig?.providerInfo?.eitriContentCmsUrl) {
		try {
			contentType = contentType === 'home' ? eitriConfig.providerInfo.faststore || eitriConfig.providerInfo.account : contentType
			result = await Eitri.http.get(eitriConfig?.providerInfo?.eitriContentCmsUrl)
		} catch (e) {
			console.error('getConfigByEitriContent eitriContentCmsUrl', eitriConfig?.providerInfo?.eitriContentCmsUrl, e)
		}
	}

	if (!result?.data?.docs) {
		result = storeConfig[eitriConfig.providerInfo.account]
	}

	const document = result?.data?.docs || result?.docs

	if (document?.length > 0) {
		const content = document.find(f => f.type.toLowerCase() === contentType.toLowerCase() || f.type.toLowerCase() === `home${contentType.toLowerCase()}`)
		const sections = content?.sections || document?.sections
		if (sections) {
			return parseEitriContentToWakeContent(sections)
		}
	}

	return null
}

const parseEitriContentToWakeContent = input => {
	const result = input.map(item => {
		const { blockType, ...rest } = item
		return {
			...rest,
			component: blockType
		}
	})
	return result
}
