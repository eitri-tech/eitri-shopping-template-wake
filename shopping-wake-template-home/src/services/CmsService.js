import Eitri from 'eitri-bifrost'
import { INFO_TYPE } from '../utils/Constants'
import { getBasicHotsiteData } from './HotsiteService'
import { componentMap } from './ComponentService'
// import { getContentHome as getWakeContentHome } from './ContentService'
import { storeConfig } from '../configs/StoreConfig'
import { setStorageItem, setStorageJSON, STGE_ITEM } from './StorageService'
import { logError } from './TrackingService'
import { getCmsProductSort } from '../utils/Util'

let responseHotsite = {}

export const getCmsHome = async () => {
	const config = await Eitri.environment.getRemoteConfigs()
	const homeKey = config.providerInfo.eitriCmsHomeKey
	return getCms(homeKey)
}

export const getCms = async (origin) => {
	const cacheKey = `${origin}Cms`
	const cachedPage = await loadPageFromCache(cacheKey)

	if (cachedPage ) {
		loadCmsContent(origin).then(result => savePageInCache(cacheKey, result)).catch(e => console.error('Error saving page to cache:', e))
		return cachedPage
	}

	const page = await loadCmsContent(origin)
	savePageInCache(cacheKey, page)
	return page
}

const loadCmsContent = async (origin) => {
	const configPage = await getConfig(origin)

	try {
		// pegando informações do conteudo no projeto
		return await getContentByConfig(configPage)
	} catch (e) {
		console.error('loadCmsContent', e)
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

const getConfig = async (origin) => {
	// Pegar primeiro config do Eitri-content
	try {
		const config = await getConfigByEitriContent(origin)
		return config
	} catch (e) {
		console.error('getConfigHome', e)
	}

	// Fallback, config do projeto
	return storeConfig[origin]
}

const getContentByConfig = async configPage => {
	let contentResult = []

	// Validate that configPage is iterable
	if (!configPage || !Array.isArray(configPage)) {
		console.warn('configPage is not a valid array:', configPage)
		return contentResult
	}

	for (const config of configPage) {
		// console.log('getContentByConfig >> config >>>>>>>>>>>>>', config)
		try {
			if (`${config.selfResolvedImage}` === 'true') {
				contentResult.push(config)
			} else if (config.hotsite) {
				const content = await getContentByHotsitePath(config.hotsite, config)
				if (content?.length > 0) contentResult = [...contentResult, ...content]
			}
		} catch (e) {
			console.error('getContentByConfig', e)
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

const getContentByHotsitePath = async (path, config) => {
	let result
	const cacheKey = config.id

	if (responseHotsite[cacheKey]) {
		result = responseHotsite[cacheKey]
	} else {
		const finalPath = path.toLowerCase() === 'home' ? '' : path
		
		const sort = getCmsProductSort(config.sort || 'orders_desc')
		const variables = {
			first: config.quantity || config.limit ? parseInt(config.quantity || config.limit) : 8,
			sortKey: sort.sortType,
			sortDirection: sort.direction,
			filter: config.filter ? config.filter : null
		}

		result = await getBasicHotsiteData(finalPath, variables)
		
		responseHotsite[cacheKey] = result
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
		const cmsUrl = `${eitriConfig.providerInfo.eitriContentCmsUrl}?where[type][equals]=${contentType}`
		try {
			result = await Eitri.http.get(cmsUrl)
		} catch (e) {
			console.error('getConfigByEitriContent', cmsUrl, e)
		}
	}

	if (!result?.data?.docs) {
		result = storeConfig[contentType]
	}

	const document = result?.data?.docs || result?.docs

	if (document?.length > 0) {
		const content = document.find(f => f.type.toLowerCase() === contentType.toLowerCase())
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
