import { Tracking } from 'eitri-shopping-wake-shared'

export const screenView = (friendlyName, className) => {
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

export const logViewCart = async (cart, currency = 'BRL') => {
	try {
		logEvent('view_cart', {
			currency: currency,
			value: cart.total,
			items: cart.products.map(item => ({
				item_id: item.productId,
				item_name: item.name,
				item_variant: item.productVariantId,
				item_quantity: item.quantity
			}))
		})
	} catch (error) {
		console.error('Erro ao montar log de visualizar carrinho', error)
	}
}
