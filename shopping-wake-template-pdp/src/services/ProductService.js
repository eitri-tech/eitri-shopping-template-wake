import { Wake } from 'eitri-shopping-wake-shared'
import { queryProduct, queryProductAttributeSelections } from '../queries/product'

/**
 * Pega produto
 *
 * @param {number} productId - O ID do produto.
 * @param {Array.<{attributeId: number, value: string}>} attributes - Opcional, Uma lista de atributos do produto.
 * @returns {Product} Objeto de produto
 */
export const getProduct = async (productId, attrSelection = null) => {
	const result = await Wake.graphQl.query(queryProduct, { productId: parseInt(productId), attrSelection })
	return result.product || null
}

/**
 * Seleciona produto por seus atributos
 *
 * @param {number} productId - O ID do produto.
 * @param {Array.<{attributeId: number, value: string}>} attributes - Uma lista de atributos do produto.
 * @returns {Product} Objeto de produto
 */
export const getProductsByAttributes = async (productId, selectedAttributes) => {
	const { attributeId, value } = selectedAttributes

	const result = await Wake.graphQl.query(queryProductAttributeSelections, {
		productId: parseInt(productId),
		attributeId: parseInt(attributeId),
		value: String(value)
	})

	return result.product || null
}

export const registerStockAlert = async (name, email, productVariantId) => {
	const result = await Wake.product.restockAlert(name, email, parseInt(productVariantId))
	return result.product || null
}

export const getProductRecommendations = async productId => {
	const result = await Wake.product.productRecommendations(productId)
	return result
}

/**
 * Pega variações disponíveis de um produto
 * @param {number} productId - O ID do produto
 * @returns {Array} Lista de variações do produto
 */
export const getProductVariations = async productId => {
	const result = await Wake.graphQl.query(queryProduct, { productId: parseInt(productId) })
	return result?.product?.attributeSelections?.selections || null
}

/**
 * Pega produto por variações selecionadas
 * @param {number} productId - O ID do produto
 * @param {Array} selectedVariations - Lista de variações selecionadas
 * @returns {Object} Produto com as variações selecionadas
 */
export const getProductByVariations = async (productId, selectedVariations) => {
	try {
		if (selectedVariations && selectedVariations.length > 0) {
			// Criar objeto de seleção para a query
			const attrSelection = selectedVariations.map(variation => ({
				attributeId: variation.attributeId,
				value: variation.value
			}))

			// Usar a query principal com as seleções de atributos
			const result = await Wake.graphQl.query(queryProduct, {
				productId: parseInt(productId),
				attrSelection
			})

			// Retornar o produto com as variações selecionadas
			return result?.product?.attributeSelections?.selectedVariant || result?.product || null
		}
		return null
	} catch (error) {
		console.error('Erro em getProductByVariations:', error)
		return null
	}
}
