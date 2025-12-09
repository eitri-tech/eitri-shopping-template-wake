import { Tracking } from 'eitri-shopping-wake-shared'

export const screenView = async (friendlyName, className) => {
	try {
		Tracking?.ga?.logScreenView(friendlyName, className)
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

export const viewItem = async product => {
	try {
		const data = {
			currency: 'BRL',
			value: product?.prices?.price,
			items: [
				{
					item_id: product.productVariantId,
					item_name: product?.variantName,
					price: product?.prices?.price
				}
			]
		}

		Tracking?.ga?.logEvent('view_item', data)
	} catch (e) {
		console.error('Error tracking screen view', e)
	}
}
