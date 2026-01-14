import { Wake } from 'eitri-shopping-wake-shared'
import { querySearchProducts } from '../queries/search'
import {
	queryCategories,
	queryProductByVariation,
	queryProductsBySearchParams,
	queryProductVariations
} from '../queries/product'

/**
 * Busca produtos pelos termos passados
 * @param {object} variables - Variáveis do Graphql responsável pela busca
 * @param {number} first - Quantidade de itens a serem retornados
 * @param {string} after - ponteiro do último item da lista, para realizar a paginação
 * @param {Array<string>} search - Array com os termos a serem pesquisados
 * @param {string} sortKey - Ordem da pesquisa, ver strings no enum `PRODUCT_SORT_TYPE`
 * @param {string} sortDirection - Direção da Ordenação podendo ser ASC ou DESC, ver strings no enum `SORT_DIRECTION`
 * @returns {Array<Product>} products - Lista de produtos
 * @returns {{ products: Array<Product>, aggregations: Array<Filters> }} Um objeto com duas propriedades:
 * - `products`: Uma lista de objetos representando os produtos.
 * - `aggregations`: Uma lista de strings representando os filtros aplicáveis.
 */
export const getProductsBySearch = async variables => {
	const partnerAccessToken = (await Wake.store.getPartnerAccessToken()) || null
	const result = await Wake.graphQl.query(querySearchProducts, { partnerAccessToken, ...variables })
	return result?.search || null
}

export const getProductsWithSearchParams = async variables => {
	const partnerAccessToken = (await Wake.store.getPartnerAccessToken()) || null
	const result = await Wake.graphQl.query(queryProductsBySearchParams, { partnerAccessToken, ...variables })
	return result?.products || null
}

export const getProductVariations = async productId => {
	const partnerAccessToken = (await Wake.store.getPartnerAccessToken()) || null
	const result = await Wake.graphQl.query(queryProductVariations, { partnerAccessToken, productId })
	return result?.product?.attributeSelections?.selections || null
}

export const getProductByVariations = async (productId, selectedVariations) => {
	const partnerAccessToken = (await Wake.store.getPartnerAccessToken()) || null
	const result = await Wake.graphQl.query(queryProductByVariation, { partnerAccessToken, productId, selectedVariations })
	return result?.product?.attributeSelections?.selectedVariant || null
}

export const getCategories = async (url = '', position = null) => {
	const partnerAccessToken = (await Wake.store.getPartnerAccessToken()) || null
	const result = await Wake.graphQl.query(queryCategories, { url, position, partnerAccessToken })
	return result?.menuGroups || null
}

export const getFormatedCategories = async (url = '', position = null, filter = null) => {
	let menuGroups = await getCategories(url, position)
	if (filter) {
		menuGroups = menuGroups.filter(filter)
	}

	const formatedMenu = formatMenuGroups(menuGroups)
	return formatedMenu
}

const formatMenuGroups = async menuGroups => {
	let menus = []
	menuGroups.map(m => (menus = [...menus, ...m.menus]))

	const mainMenus = menus.filter(m => m.level === 0 || m.parentMenuId == null).sort(sortByOrder)
	const level1Menus = menus.filter(m => m.level === 1).sort(sortByOrder)
	const level2Menus = menus.filter(m => m.level === 2).sort(sortByOrder)

	for (let menu of mainMenus) {
		if (menu.level === 0) {
			let submenus = level1Menus.filter(m => m.parentMenuId === menu.menuId)
			menu.submenus = submenus || []
		} else if (menu.level === 1) {
			let submenus = level2Menus.filter(m => m.parentMenuId === menu.menuId)
			menu.submenus = submenus || []
		}
	}

	return mainMenus
}

const sortByOrder = (a, b) => {
	return a.order > b.order ? 1 : a.order < b.order ? -1 : 0
}

export const resolveFilterQueryString = queryString => {
	let filters = []
	if (queryString) {
		const queryStringValues = queryString.split('&')
		if (queryStringValues.length > 0) {
			for (const field of queryStringValues) {
				const fieldSplit = field.split('=')
				if (fieldSplit.length > 1) {
					const fieldName = fieldSplit[0]
					const fieldValue = fieldSplit[1]
					if (fieldName === 'filtro') {
						const filterValues = fieldValue.split('__')
						if (filterValues.length > 1) {
							filters.push({
								field: filterValues[0],
								values: [filterValues[1]]
							})
						}
					}
				}
			}
		}
	}
	return filters
}
