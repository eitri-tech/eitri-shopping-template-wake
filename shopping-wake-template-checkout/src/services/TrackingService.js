import { Tracking } from 'eitri-shopping-wake-shared'
import Eitri from 'eitri-bifrost'

export const logScreenView = async (friendlyName, className) => {
	try {
		Tracking.ga.logScreenView(friendlyName, className)
	} catch (e) {
		console.error('Error tracking screen view', e)
	}
}

export const logEvent = async (event, data) => {
	try {
		Tracking.ga.logEvent(event, data)
	} catch (e) {
		console.error('Error tracking screen view', e)
	}
}

export const logError = async (event, error) => {
	try {
		Tracking.ga.logError(event, error)
	} catch (e) {
		console.error('Error tracking screen view', e)
	}
}

export const sendGaBeginCheckout = async cart => {
	const payload = {
		currency: 'BRL',
		value: cart?.total || 0,
		items: []
	}
	if (cart?.products?.length > 0) {
		const items = cart.products.map(product => {
			const variant = product.productAttributes ? product.productAttributes.map(v => v.value) : null
			return {
				item_id: product?.productVariantId,
				item_name: product?.name,
				price: product?.price,
				quantity: product?.quantity,
				item_variant: variant ? variant.join('/') : ''
			}
		})
		payload.items = items
	}

	logEvent('begin_checkout', payload)
}

export const sendLogError = async (error, method, data = {}) => {
	try {
		const environment = await Eitri.environment.getName()
		if (environment === 'dev') return

		const payload = {
			origin: 'APP-SHOPPING',
			eventName: `${window.__eitriAppConf?.slug}`,
			slug: `${window.__eitriAppConf?.slug}`,
			version: window.__eitriAppConf?.version,
			data: {
				app: `${window.__eitriAppConf?.account}`,
				applicationId: window.__eitriAppConf?.applicationId,
				method: method || '',
				error: {
					message: error?.response?.message || '',
					data: JSON.stringify(error?.response?.data || {})
				},
				rawError: {
					message: error?.message,
					stack: error?.stack,
					name: error?.name,
					...error
				},
				...data
			}
		}

		Eitri.http.post('https://api.eitri.tech/analytics/event', payload, {
			'Content-Type': 'application/json',
			'application-id': window.__eitriAppConf?.applicationId
		})
	} catch (e) {
		console.error('Erro ao setar user', e)
	}
}
