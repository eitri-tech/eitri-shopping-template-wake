import Eitri from 'eitri-bifrost'
import { Wake } from 'eitri-shopping-wake-shared'
import { logError } from './TrackingService'

/**
 * Pega carrinho simples da loja.
 * @returns {SimpleCart<{cartId: string, quantity: number}>} Carrinho simples com Id e quantidade de itens.
 * @see {@link getCheckout} para pegar carrinho completo.
 */
export const getCart = async () => {
	try {
		const cart = await Wake.cart.getCheckout()
		addMetadata(cart?.checkoutId)
		return cart
	} catch (error) {
		logError('Erro ao buscar carrinho', error)
		console.error('Erro ao buscar carrinho', error)
		throw error
	}
}

export const generateNewCart = async () => {
	try {
		const cart = await Wake.cart.generateNewCart()
		addMetadata(cart?.checkoutId)
		return cart
	} catch (error) {
		logError('Erro ao gerar novo carrinho', error)
		console.error('Erro ao gerar novo carrinho', error)
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
		logError('Erro ao buscar carrinho', error)
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
		return checkout
	} catch (error) {
		logError('Erro ao buscar carrinho completo', error)
		console.error('Erro ao buscar carrinho completo', error)
		throw error
	}
}

export const addItemToCart = async (productVariantId, quantity) => {
	try {
		return await Wake.cart.addItems([{ productVariantId, quantity }])
	} catch (error) {
		logError('Erro ao adicionar item ao carrinho', error)
		console.error('Erro ao adicionar item ao carrinho', productVariantId, error)
		throw error
		// crashLog('Erro ao adicionar item ao carrinho', error)
	}
}

export const removeCartItem = async index => {
	// try {
	// 	return await Vtex.cart.removeItem(index)
	// } catch (error) {
	// 	console.error('Erro ao adicionar item ao carrinho', error)
	// 	// crashLog('Erro ao adicionar item ao carrinho', error)
	// }
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
