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
 * Remove um item específico de um array de strings.
 * @param {string[]} array - O array de strings do qual o item será removido.
 * @param {string} item - O item a ser removido do array.
 * @returns {string[]} O array atualizado sem o item especificado.
 */
export const removeItemFromArray = (array, item) => {
	const index = array.indexOf(item)
	if (index !== -1) {
		array.splice(index, 1)
	}
	return array
}

export const formatDeliveryMessage = (deadline, deadlineInHours, isPickup) => {
	if (isPickup) {
		if (deadline === 0) return 'Retire hoje'
		return `Retire a partir de ${deadline} ${deadline === 1 ? 'dia útil' : 'dias úteis'}`
	}

	if (deadlineInHours) {
		return `Entrega em até ${deadlineInHours} ${deadlineInHours === 1 ? 'hora' : 'horas'}`
	}

	if (deadline === 0) return 'Entrega hoje'

	return `Entrega em até ${deadline} ${deadline === 1 ? 'dia útil' : 'dias úteis'}`
}

export const getWindowFilledHeight = async (headerId, footerId) => {
	const configs = await Eitri.getConfigs()

	let bottomSafeArea = configs?.superAppData?.safeAreaInsets?.bottom || 0
	let headerHeight = getElementHeight(headerId)
	const footerHeight = footerId ? getElementHeight(footerId) : 0

	if (configs?.superAppData?.platform === 'android' && window.devicePixelRatio > 0) {
		bottomSafeArea = bottomSafeArea / window.devicePixelRatio
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