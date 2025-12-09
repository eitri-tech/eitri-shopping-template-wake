import { Wake } from 'eitri-shopping-wake-shared'

export const addItemToCart = async (productVariantId, quantity) => {
	try {
		return await Wake.cart.addItems([{ productVariantId, quantity }])
	} catch (error) {
		console.error('Erro ao adicionar item ao carrinho', productVariantId, error)
		throw error
		// crashLog('Erro ao adicionar item ao carrinho', error)
	}
}
