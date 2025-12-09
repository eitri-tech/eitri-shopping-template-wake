import { Wake } from 'eitri-shopping-wake-shared'

export const forceCartId = async cartId => {
	try {
		console.log('Forçando carrinho para:', cartId)
		return await Wake.cart.forceCartId(cartId)
	} catch (error) {
		console.error('Erro ao forçar carrinho', error)
	}
}
