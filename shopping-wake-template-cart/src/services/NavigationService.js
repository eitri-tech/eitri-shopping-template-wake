import Eitri from 'eitri-bifrost'

/**
 * Abre o EitriApp de Checkout
 */
export const openCheckout = async () => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'checkout'
		})
	} catch (e) {
		console.error('navigate to Checkout: Error', e)
	}
}

export const openProduct = async (productId, currentPage) => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'pdp',
			initParams: { productId }
		})
	} catch (e) {
		console.error('navigate to pdp: Error trying to open product', e)
	}
}
