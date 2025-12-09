import Eitri from 'eitri-bifrost'
import { Wake } from 'eitri-shopping-wake-shared'

/**
 * Pega carrinho simples da loja.
 * @returns {SimpleCart<{cartId: string, quantity: number}>} Carrinho simples com Id e quantidade de itens.
 * @see {@link getCheckout} para pegar carrinho completo.
 */
export const getCart = async cartId => {
	try {
		const cart = await Wake.cart.getCurrentOrCreateCart(cartId)
		addMetadata(cart?.checkoutId)
		return cart
	} catch (error) {
		console.error('Erro ao buscar carrinho', error)
		throw error
	}
}

/**
 * Pega carrinho da loja com retorno em formato Wake.
 * @returns {WakeCart} Objeto de carrinho Wake
 * @see {@link getCheckout} para pegar carrinho completo.
 */
export const getCartById = async cartId => {
	try {
		const cart = await Wake.cart.getCartById(cartId)
		addMetadata(cart?.checkoutId)
		return cart
	} catch (error) {
		console.error('Erro ao buscar carrinho', cartId, error)
		throw error
	}
}

/**
 * Pega carrinho completo da loja.
 *
 * @returns {Checkout} Objeto com todos os dados do carrinho
 */
export const getCheckout = async cartId => {
	try {
		const checkout = await Wake.cart.getCheckout(cartId)
		addMetadata(checkout?.checkoutId)
		return checkout
	} catch (error) {
		console.error('Erro ao buscar carrinho completo', error)
		throw error
	}
}

export const addItemToCart = async (productVariantId, quantity) => {
	try {
		return await Wake.cart.addItems([{ productVariantId, quantity }])
	} catch (error) {
		console.error('Erro ao adicionar item ao carrinho', productVariantId, error)
		throw error
		// crashLog('Erro ao adicionar item ao carrinho', error)
	}
}

export const removeCartItem = async (productVariantId, quantity) => {
	try {
		return await Wake.cart.removeItems([{ productVariantId, quantity }])
	} catch (error) {
		console.error('Erro ao remover item do carrinho', productVariantId, error)
		throw error
		// crashLog('Erro ao adicionar item ao carrinho', error)
	}
}

const addMetadata = async checkoutId => {
	if (!checkoutId) return

	try {
		const { applicationData } = await Eitri.getConfigs()
		const platform = applicationData?.platform === 'ios' ? 'eitri_ios' : 'eitri_android'
		const marketingTag = [{ key: 'platform', value: platform }]
		await Wake.checkout.addCheckoutMetadata(checkoutId, marketingTag)
	} catch (e) {
		console.error('Erro ao adicionar metadata', e)
	}
}
