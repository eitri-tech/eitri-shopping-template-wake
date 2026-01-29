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
		addEitriMetadata(cart?.checkoutId)
		return cart
	} catch (error) {
		console.error('Erro ao buscar carrinho', error)
		throw error
	}
}

/**
 * Pega carrinho completo da loja.
 * @returns {Checkout} Objeto com todos os dados do carrinho
 */
export const getCheckout = async cartId => {
	try {
		const checkout = await Wake.cart.getCheckout(cartId)
		addEitriMetadata(checkout?.checkoutId)
		return checkout
	} catch (error) {
		console.error('Erro ao buscar carrinho completo', error)
		throw error
	}
}

export const addCartItem = async (productVariantId, quantity) => {
	try {
		const response = await Wake.cart.addItems([
			{ productVariantId: parseInt(productVariantId), quantity: parseInt(quantity) }
		])
		return response
	} catch (error) {
		console.error('Erro ao adicionar item ao carrinho', error)
		// crashLog('Erro ao adicionar item ao carrinho', error)
	}
}

//{productVariantId: number, quantity: number}
export const removeCartItem = async (productVariantId, quantity) => {
	try {
		const response = await Wake.cart.removeItems([
			{ productVariantId: parseInt(productVariantId), quantity: parseInt(quantity) }
		])
		return response
	} catch (error) {
		console.error('Erro ao remover item do carrinho', error)
		// crashLog('Erro ao remover item do carrinho', error)
	}
}

/**
 * Calcula frete
 * @param {string} zipCode - cep para o cálculo
 * @param {Array<{ productVariantId: number, quantity: number }>} products - array de produtos do carrinho
 * @returns {object} opções de entrega
 */
export const getShipping = async (zipCode, products) => {
	try {
		// TODO - Enviar código para o SHARED WAKE
		const queryShippingQuotes = `query ($zipCode: CEP, $products: [productsInput]) {
			shippingQuotes(
				cep: $zipCode
				products: $products
			) {
				name
				type
				value
				deadline
				products {
					productVariantId
					value
				}
			}
		}`

		const result = await Wake.graphQl.query(queryShippingQuotes, { zipCode, products })
		return result.shippingQuotes || result
	} catch (error) {
		console.error('Erro ao buscar frete', error)
		throw error
	}
}

export const getShippingQuotes = async zipCode => {
	const result = await Wake.checkout.shippingQuotes({ cep: zipCode })
	return result?.shippingQuotes
}

/**
 * Adicionar cupom ao carrinho
 * @param {string} coupon - Código do Cupom
 * @returns {object} resposta da inclusão do cupom
 */
export const addCouponToCart = async coupon => {
	try {
		const result = await Wake.checkout.checkoutAddCoupon(coupon.trim())
		return result?.checkoutAddCoupon || result
	} catch (error) {
		console.error('Erro ao adicionar cupom ao carrinho', error)
		throw error
	}
}

export const removeCouponFromCart = async coupon => {
	try {
		const result = await Wake.checkout.checkoutRemoveCoupon(coupon.trim())
		return result?.checkoutRemoveCoupon
	} catch (error) {
		console.error('Erro ao remover cupom do carrinho', error)
		throw error
	}
}

export const forceCartId = async cartId => {
	try {
		return await Wake.cart.forceCartId(cartId)
	} catch (error) {
		console.error('Erro ao forçar carrinho', error)
	}
}

/**
 * Adiciona metadados de checkout
 * @param {string} checkoutId
 * @param {Array<key:string, value:string>} params
 * @returns 
 */
export const addCheckoutMetadata = async (checkoutId, params) => {
	if (!checkoutId) return

	try {
		const cart = await Wake.checkout.addCheckoutMetadata(checkoutId, params)
		return cart.checkoutAddMetadata || null
	} catch (e) {
		console.error('Erro ao adicionar metadata', e)
	}
}

/**
 * Remove metadados de checkout
 * @param {Array<string>} params 
 * @returns 
 */
export const removeCheckoutMetadata = async (params) => {
	try {
		const cart = await Wake.checkout.checkoutRemoveMetadata(params)
		return cart.checkoutRemoveMetadata || null
	} catch (error) {
		console.error('Erro ao gerar novo carrinho', error)
		throw error
	}
}

const addEitriMetadata = async checkoutId => {
	if (!checkoutId) return

	try {
		const { applicationData } = await Eitri.getConfigs()
		const platform = applicationData?.platform === 'ios' ? 'eitri_ios' : 'eitri_android'
		const marketingTag = [{ key: 'platform', value: platform }]
		await addCheckoutMetadata(checkoutId, marketingTag)
	} catch (e) {
		console.error('Erro ao adicionar metadata', e)
	}
}