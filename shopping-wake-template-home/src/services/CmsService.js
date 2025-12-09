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

const getConfigHome = async () => {
	const config = await Eitri.environment.getRemoteConfigs()

	// Pegar primeiro config do Eitri-content
	try {
		// // cache
		// const cacheExpiresAt = await getStorageItem(STGE_ITEM.CMS_CONFIG_HOME_EXPIRES_AT)
		// const dateNow = new Date().toISOString()
		// if (dateNow < cacheExpiresAt) {
		// 	const cmsConfigCache = await getStorageJSON(STGE_ITEM.CMS_CONFIG_HOME)
		// 	if (cmsConfigCache) {
		// 		resolveCmsConfigHome()
		// 		console.log('cmsHomeCache >> cache >>>>>>', JSON.stringify(cmsConfigCache))
		// 		return cmsConfigCache
		// 	}
		// }

		const eitriContent = await resolveCmsConfigHome()
		// console.log('eitriContent >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', eitriContent)
		if (eitriContent) {
			return eitriContent
		}
	} catch (e) {
		logError('getConfigHome', e)
		console.error('getConfigHome', e)
	}

	// Fallback, config do projeto
	// return storeConfig[Wake.account]
	return storeConfig[config.providerInfo.account]
}

const resolveCmsConfigHome = async () => {
	const eitriContentHome = await getConfigByEitriContent('home')
	if (eitriContentHome) {
		// data de expiração do cache
		const cacheExpiration = new Date()
		cacheExpiration.setMinutes(cacheExpiration.getMinutes() + 10) // Adiciona 10 minutos
		await setStorageItem(STGE_ITEM.CMS_CONFIG_HOME_EXPIRES_AT, cacheExpiration.toISOString()).catch(e =>
			console.error('SaveCmsHomeStorage expiresAt', e)
		)
		// console.log('cacheExpiration.toISOString() >>>>>>>>', cacheExpiration.toISOString())

		// conteudo do cms
		await setStorageJSON(STGE_ITEM.CMS_CONFIG_HOME, eitriContentHome).catch(e =>
			console.error('SaveCmsHomeStorage', e)
		)
		return eitriContentHome
	}
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
	// const url = `https://implantacao-content.eitri.tech/api/wake-cms-pages`
	// const url = eitriConfig.wakeCmsUrl
	// const result = await Eitri.http.get(url)
	// eitriConfig.eitriContentCmsUrl = 'http://implantacao.localhost:8080/api/wake-cms-pages/?where[type][equals]=balaroti'

	let result
	if (eitriConfig?.providerInfo?.eitriContentCmsUrl) {
		let url
		try {
			const _contentType =
				contentType === 'home'
					? eitriConfig.providerInfo.faststore || eitriConfig.providerInfo.account
					: contentType
			// url = `${eitriConfig.providerInfo.eitriContentCmsUrl}?where[type][equals]=${_contentType}`
			url = `${eitriConfig.providerInfo.eitriContentCmsUrl}`
			result = await Eitri.http.get(url)
			contentType = _contentType
		} catch (e) {
			// logError('getConfigByEitriContent wakeCmsUrl:', e)
			console.error('getConfigByEitriContent eitriContentCmsUrl', url, e)
		}
	}

	if (!result?.data?.docs) {
		result = storeConfig[eitriConfig.providerInfo.account]
	}

	const document = result?.data?.docs || result?.docs

	if (document?.length > 0) {
		const content = document.find(f => f.type.toLowerCase() === contentType.toLowerCase())
		if (content?.sections) {
			return parseEitriContentToWakeContent(content.sections)
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
