import Eitri from 'eitri-bifrost'

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

/**
 * Aguarda o carregamento de uma imagem.
 * @param {string} imgUrl - A URL da imagem a ser carregada.
 * @returns {Promise<void>} Retorna uma promessa que é resolvida quando a imagem é carregada.
 */
export const waitImageLoad = async imgUrl => {
	if (imgUrl) {
		return new Promise(resolve => {
			const img = new Image()
			img.src = imgUrl
			img.onload = () => {
				resolve(true)
			}
		})
	}
}

export const getWindowFilledHeight = async (headerId, footerId) => {
	const configs = await Eitri.getConfigs()

	let bottomSafeArea = configs?.superAppData?.safeAreaInsets?.bottom || 0
	let headerHeight = getElementHeight(headerId)
	const footerHeight = footerId ? getElementHeight(footerId) : 0

	if (configs?.superAppData?.platform === 'android') {
		if (configs.superAppData.eitriVersion >= '3.13.0') {
			bottomSafeArea = 0
		} else if (window.devicePixelRatio > 0) {
			bottomSafeArea = bottomSafeArea / window.devicePixelRatio
		}
	}

	const filledArea = headerHeight + footerHeight + bottomSafeArea
	return filledArea
}

const getElementHeight = elementId => {
	const element = document.getElementById(elementId)
	if (element) {
		const elementHeight = element.offsetHeight
		return elementHeight
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