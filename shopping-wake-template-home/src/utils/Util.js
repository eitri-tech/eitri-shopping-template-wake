import Eitri from 'eitri-bifrost'
import { CMS_PRODUCT_SORT, LIST_ORDERING, PRODUCT_SORT_TYPE, SORT_DIRECTION } from './Constants'

export const delay = async ms => {
	return new Promise((resolve, _reject) => setTimeout(resolve, ms))
}

export const formatCurrency = value => {
	const valueBRL = parseFloat(value).toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	})

	return valueBRL
}

export const calculeBestDimensions = async (imgUrl, maxFactorHeigth = 0.75) => {
	return new Promise(resolve => {
		const img = new Image()
		img.src = imgUrl
		img.onload = () => {
			const response = {}
			const width = img.width
			const height = img.height
			const deviceHeight = window.innerHeight * maxFactorHeigth
			const deviceWidth = window.innerWidth

			const factorW = deviceWidth / width
			const factorH = deviceHeight / height

			const newWidth = width * factorH // para altura 100%
			const newHeight = height * factorW // para largura 100%

			// proporção com W 100%
			if (newHeight <= deviceHeight) {
				response.height = newHeight
				response.width = deviceWidth
			} else if (newWidth > width || width > height) {
				// proporção com H 75% ou se a largura for > altura
				response.height = deviceHeight
				response.width = newWidth
			} else {
				// default: proporção com W 100% e altura calculada (pode passar da altura máxima)
				response.height = newHeight
				response.width = deviceWidth
			}

			resolve(response)
		}
	})
}

/**
 * Compute banner height in vw units from image dimensions and clamp it to viewport height.
 * @param {{width:number,height:number}} dimensions - image dimensions (px)
 * @param {number} widthBanner - desired banner width in vw (e.g. 100)
 * @param {number} maxViewportFactor - max fraction of the viewport height to allow (1 = full viewport)
 * @returns {number} height in vw (integer)
 */
export const computeBannerHeightVW = (dimensions, widthBanner = 100, maxViewportFactor = 1) => {
	if (!dimensions || !dimensions.width || !dimensions.height) return widthBanner
	const computed = parseInt((parseInt(dimensions.height) * widthBanner) / dimensions.width)
	// maximum allowed in vw units based on current viewport
	const maxVW = (window.innerHeight / window.innerWidth) * 100 * maxViewportFactor
	return Math.min(computed, Math.floor(maxVW))
}

export const getImageDimensions = async imgUrl => {
	return new Promise(resolve => {
		const img = new Image()
		img.src = imgUrl
		img.onload = () => {
			const response = {}
			const width = img.width
			const height = img.height
			response.height = height
			response.width = width
			resolve(response)
		}
	})
}

export const detachUrl = url => {
	let cloneUrl = `${url}`
	cloneUrl = cloneUrl.trim().replace(/\?.*/, '')

	if (cloneUrl.toLowerCase().startsWith('http')) {
		let urlparts = cloneUrl.split('/')
		const newUrlParts = urlparts.slice(3)
		cloneUrl = newUrlParts.join('/')
	}

	if (cloneUrl.startsWith('/')) {
		cloneUrl = cloneUrl.substring(1)
	}

	return cloneUrl
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

export const getRemoteAppConfigProperty = async property => {
	const remoteConfig = await Eitri.environment.getRemoteConfigs()
	const appConfigs = remoteConfig?.appConfigs
	return appConfigs?.[property]
}

export const convertExtraParams = extraParams => {
	const returnParams = {}
	extraParams.map(param => {
		returnParams[param.key] = param.value
	})
	return returnParams
}

export const applyFilterContent = (data, field, operator, value) => {
	field = field.trim()

	return data.filter(item => {
		// console.log('MultipleImageBanner >> item[field] >>>>>>>>>>>', item[field], field, operator, value)
		if (item[field] === undefined || item[field] === null) {
			return false
		}

		switch (operator.trim()) {
			case '===':
			case '==':
				return `${item[field]}`.trim().toLowerCase() === value.trim().toLowerCase()
			case '!==':
			case '!=':
				return `${item[field]}`.trim().toLowerCase() !== value.trim().toLowerCase()
			case '>':
				return Number(item[field]) > Number(value)
			case '>=':
				return Number(item[field]) >= Number(value)
			case '<':
				return Number(item[field]) < Number(value)
			case '<=':
				return Number(item[field]) <= Number(value)
			case 'includes':
				return item[field].includes(value.trim())
			case 'startsWith':
				return item[field].startsWith(value.trim())
			case 'endsWith':
				return item[field].endsWith(value.trim())
			default:
				return false
		}
	})
}

export const consvertSize = size => {
	switch (size) {
		case 'small':
		case 'extra-small':
			return '1'
		case 'medium':
			return '2'
		case 'large':
			return '3'
		case 'extra-large':
			return '4'
		case 'display':
			return '5'
		default:
			return '0'
	}
}

export const isVideo = url => {
	const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv']
	const baseurl = url.replace(/\?.*/, '')
	const extension = baseurl.split('.').pop().toLowerCase()

	return videoExtensions.includes(extension) ? extension : null
}

export const isImage = url => {
	const imageExtensions = ['jpeg', 'jpg', 'gif', 'png', 'svg', 'webp', 'bmp', 'tiff']
	const baseurl = url.replace(/\?.*/, '')
	const extension = baseurl.split('.').pop().toLowerCase()

	return imageExtensions.includes(extension) ? extension : null
}

export const canPlayVideo = async videoUrl => {
	console.log('canPlayVideo INIT')
	return new Promise(resolve => {
		const video = document.createElement('video')
		video.src = videoUrl

		/* opções do evento
			onloadedmetadata -> quando os metadados (duração, dimensões) estão disponíveis
			oncanplay -> quando já é possível começar a reproduzir
			oncanplaythrough -> quando o vídeo pode ser reproduzido até o fim sem parar para buffering
			onerror -> quando ocorrer um erro
		*/
		console.log('canPlayVideo')
		video.onloadedmetadata = () => {
			console.log('carregamento do video executado com sucesso')
			resolve(true)
		}
		setTimeout(() => {
			console.log('carregamento do video executado com sucesso')
			resolve(true)
		}, 3000)
		video.load()
	})
}

export const getDefaultSort = (
	params,
	defaultSortType = PRODUCT_SORT_TYPE.SALES,
	defaultSortDirection = SORT_DIRECTION.DESC
) => {
	const sortType = params?.sort || defaultSortType
	const direction = params?.sortDirection || defaultSortDirection

	const sort = LIST_ORDERING.values.find(item => item.sortType === sortType && item.direction === direction)
	if (sort) {
		return sort
	}
	return LIST_ORDERING.values[0]
}

export const getCmsProductSort = cmsSort => {
	if (!cmsSort || !CMS_PRODUCT_SORT[cmsSort]) return null

	const sort = LIST_ORDERING.values.find(item => item.id === CMS_PRODUCT_SORT[cmsSort])
	if (sort) {
		return sort
	}
	return LIST_ORDERING.values[0]
}

export const slugify = str => {
	if (typeof str !== 'string' || !str.trim()) {
		return '' // retorna vazio por padrão
	}

	return str
		.normalize('NFD') // decompõe "ã" em "a" + "~"
		.replace(/[\u0300-\u036f]/g, '') // remove o "~"
		.replace(/[^A-Za-z0-9]+/g, '_') // tudo que não for letra/número vira "_"
		.replace(/_+/g, '_') // colapsa múltiplos "_" em um só
		.replace(/^_|_$/g, '') // remove "_" nas extremidades
		.toLowerCase() // passa para minúsculo
}

export const formatImageUrl = (urlString, width, height) => {
	if (!urlString) return ''
	try {
		const url = new URL(urlString);

		// remove w e h sempre
		url.searchParams.delete('w');
		url.searchParams.delete('h');

		// Se width/height forem fornecidos, recoloca
		if (width) url.searchParams.set('w', width);
		if (height) url.searchParams.set('h', height);

		return url.toString();
	} catch {
		return urlString
	}
}

export const formatPrice = (price, _locale, _currency) => {
	if (!price) return ''

	const locale = _locale || App?.configs?.storePreferences?.locale || 'pt-BR'
	const currency = _currency || App?.configs?.storePreferences?.currencyCode || 'BRL'

	return price.toLocaleString(locale, { style: 'currency', currency: currency })
}

let cartmantCountdown = 10
export const goToCartman = () => {
	if (cartmantCountdown === 0) {
		Eitri.navigation.navigate({ path: 'Cartman' })
		cartmantCountdown = 7
	} else {
		cartmantCountdown--
	}
}