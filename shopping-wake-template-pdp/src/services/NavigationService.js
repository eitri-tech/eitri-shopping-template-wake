import Eitri from 'eitri-bifrost'

export const openCart = async cartId => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'cart',
			initParams: { orderFormId: cartId || '' }
		})
		console.log('Navega para carrinho')
	} catch (e) {
		console.error('navigate to cart: Error trying to open cart', e)
	}
}

let promiseRequestLogin
export const requestLogin = async () => {
	// console.log('Indo para a tela de login')
	try {
		await uniqueRequestLogin()
	} catch (e) {
		console.error('requestLogin Error:'), e
	}

	promiseRequestLogin = undefined
	// console.log('Voltou da tela de login')
}

const uniqueRequestLogin = () => {
	if (promiseRequestLogin) return promiseRequestLogin

	promiseRequestLogin = new Promise(resolve => {
		console.log('requestLogin ', new Date().toISOString())
		Eitri.nativeNavigation.open({
			slug: 'account',
			initParams: { action: 'RequestLogin' }
		})
		Eitri.navigation.setOnResumeListener(resolve)
	})
	return promiseRequestLogin
}

export const openPageError = async (replace = false) => {
	try {
		Eitri.navigation.navigate({ path: 'ErrorNotFound', replace })
	} catch (e) {
		console.error('navigate to cart: Error trying to open cart', e)
	}
}

export const openProduct = async (productId, productVariationId) => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'pdp',
			initParams: { productId, productVariationId }
		})
	} catch (e) {
		console.error('navigate to PDP: Error', e)
	}
}
