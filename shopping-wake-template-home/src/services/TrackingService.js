import { Tracking } from 'eitri-shopping-wake-shared'
import { getCart } from './CartService'

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
		let msgError = error?.message ?? error?.data?.message ?? error?.errors ?? error
		Tracking.ga.logError(event, { error: msgError })
	} catch (e) {
		console.error('logError', e)
	}
}

export const sendLogError = async (error, method, data = {}) => {
	try {

		const device = await Eitri.device.getInfos()

		const checkout = await getCart()

		const payload = {
			origin: 'APP-SHOPPING-ERROR',
			eventName: `${window.__eitriAppConf?.slug}`,
			slug: `${window.__eitriAppConf?.slug}`,
			version: window.__eitriAppConf?.version,
			data: {
				application: window.__eitriAppConf?.application || '',
				applicationId: window.__eitriAppConf?.applicationId,
				device,
				method: method || '',
				email: checkout?.customer?.email || '',
				cartId: checkout?.checkoutId || '',
				error: {
					message: error?.message,
					stack: error?.stack,
					name: error?.name,
					...error
				},
				...data
			}
		}

		const environment = await Eitri.environment.getName()
		if (environment === 'dev') {
			console.log('Error', payload)
			return
		}

		Eitri.http.post('https://api.eitri.tech/analytics/event', payload, {
			'Content-Type': 'application/json',
			'application-id': window.__eitriAppConf?.applicationId
		})
	} catch (e) {
		console.error('Erro ao enviar log', e)
	}
}