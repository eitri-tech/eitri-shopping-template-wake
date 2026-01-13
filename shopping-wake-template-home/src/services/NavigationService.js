import Eitri from 'eitri-bifrost'
import { Wake } from 'eitri-shopping-wake-shared'
import { detachUrl } from '../utils/Util'
import { URI_TYPE } from '../utils/Constants'
import { queryUri } from '../queries/uri'
import { logError } from './TrackingService'

export const openCart = async cartId => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'cart',
			initParams: { orderFormId: cartId || '' }
		})
	} catch (e) {
		logError('openCart', e)
		console.error('navigate to cart: Error', e)
	}
}

/**
 * Abre o EitriApp de detalhe do produto
 * @param {(number|string)} productId - Id do produto.
 * @param {(number|string)} productVariationId - Id da variação do produto.
 */
export const openProduct = async (productId, productVariationId) => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'pdp',
			initParams: { productId, productVariationId }
		})
	} catch (e) {
		logError('openProduct', e)
		console.error('navigate to PDP: Error', e)
	}
}

/**
 * Abre o EitriApp de perfil do cliente
 */
export const openAccount = async () => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'account'
		})
	} catch (e) {
		logError('openAccount', e)
		console.error('navigate to Account: Error', e)
	}
}

/**
 * Abre a página de HotSite e realiza uma busca por produtos, banners e conteudos com a url fornecida.
 * @param {string} url - Path do hotsite.
 * @param {string} title - Titulo que aparecerá no header da página, default="Catalogo".
 * @param {Object} searchParams - Opcional, Parametros para a busca, como ordem e quantidade de produtos.
 */
export const openHotsiteOrProduct = async (url, title, searchParams) => {
	try {
		const pageType = await getUrlType(url)
		if (pageType?.kind === URI_TYPE.PRODUCT) {
			const productId = url.replace(/.*-/g, '')
			if (!isNaN(productId)) {
				openProduct(productId)
				return
			}
		} else if (pageType?.kind === URI_TYPE.HOTSITE) {
			const _url = detachUrl(url)
			// Eitri.nativeNavigation.open({
			// 	slug: 'home',
			// 	initParams: {
			// 		route: 'Hotsite',
			// 		url: _url,
			// 		title,
			// 		searchParams
			// 	}
			// })
			Eitri.navigation.navigate({ path: 'Hotsite', state: { url: _url, title, searchParams }, replace: false })
			return
		}
	} catch (e) {
		// logError('openHotsiteOrProduct', e)
		console.error('navigate openHotsiteOrProduct Error', e)
	}

	openPageError()
}

/**
 * Abre a página de HotSite e realiza uma busca por produtos, banners e conteudos com a url fornecida.
 * @param {string} url - Path do hotsite.
 * @param {string} title - Titulo que aparecerá no header da página, default="Catalogo".
 * @param {Object} searchParams - Opcional, Parametros para a busca, como ordem e quantidade de produtos.
 */
export const openHotsite = async (url, title, searchParams, replace = false) => {
	try {
		// Eitri.nativeNavigation.open({
		// 	slug: 'home',
		// 	initParams: {
		// 		route: 'Hotsite',
		// 		url,
		// 		title,
		// 		searchParams
		// 	}
		// })
		Eitri.navigation.navigate({ path: 'Hotsite', state: { url, title, searchParams }, replace: false })
	} catch (e) {
		logError('openHotsite', e)
		console.error('navigate to Hotsite: Error', e)
	}
}

/**
 * Abre a página de busca e realiza uma busca com o termo fornecido.
 * @param {string} term - As palavras ou frases a serem buscadas.
 */
export const openSearch = async (term, searchParams, replace = false) => {
	try {
		Eitri.navigation.navigate({ path: 'Search', state: { term }, replace: false })
	} catch (e) {
		logError('openSearch', e)
		console.error('navigate to openSearch: Error', e)
	}
}

export const openWishList = async () => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'account',
			initParams: { action: 'favorites' }
		})
	} catch (e) {
		logError('openWishList', e)
		console.error('navigate to WishList: Error', e)
	}
}

export const openPageError = async () => {
	try {
		Eitri.nativeNavigation.open({ slug: 'pdp' })
	} catch (e) {
		logError('openPageError', e)
		console.error('navigate to PageError: Error', e)
	}
}

export const getUrlType = async url => {
	const _url = detachUrl(url)
	const partnerAccessToken = (await Wake.store.getPartnerAccessToken()) || null
	const result = await Wake.graphQl.query(queryUri, { url: _url, partnerAccessToken })
	return result?.uri || null
}

let promiseRequestLogin
export const requestLogin = async () => {
	try {
		await uniqueRequestLogin()
	} catch (e) {
		console.error('requestLogin Error:'), e
	}

	promiseRequestLogin = undefined
}

const uniqueRequestLogin = () => {
	if (promiseRequestLogin) return promiseRequestLogin

	promiseRequestLogin = new Promise(resolve => {
		Eitri.nativeNavigation.open({
			slug: 'account',
			initParams: { action: 'RequestLogin' }
		})
		Eitri.navigation.setOnResumeListener(resolve)
	})
	return promiseRequestLogin
}

export const openZipCodeVerification = async () => {
	try {
		Eitri.navigation.navigate({ path: 'ZipCodeVerification', replace: false })
	} catch (e) {
		console.error('navigate to ZipCodeVerification: Error', e)
	}
}