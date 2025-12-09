import { Tracking } from 'eitri-shopping-wake-shared'

export const logScreenView = async currentPage => {
	try {
		Tracking.ga.logScreenView(currentPage)
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
