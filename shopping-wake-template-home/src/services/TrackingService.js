import { Tracking } from 'eitri-shopping-wake-shared'

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
