import { PRODUCT_SORT_TYPE, SORT_DIRECTION } from './Constants'

const decodeParam = value => {
	try {
		return decodeURIComponent(value.replace(/\+/g, ' '))
	} catch (e) {
		return value
	}
}

const parsePrice = value => {
	const price = parseFloat(`${value}`.replace(',', '.'))

	return isNaN(price) ? null : price
}

/**
 * Lê a query string de uma URL de hotsite no padrão do site Wake e converte nas variáveis da query `hotsite`.
 * Ex.: `/black-friday?filtro=Categoria__Sapatilha&precoPor=49.90;201.00&ordenacao=RELEASE_DATE:DESC`
 * @param {string} url - URL completa, path com query string ou só a query string.
 * @returns {{filter: Array<{field: string, values: string[]}>, minimumPrice: (number|null), maximumPrice: (number|null), sortKey: (string|null), sortDirection: (string|null)}}
 */
export const parseHotsiteQueryString = url => {
	const result = { filter: [], minimumPrice: null, maximumPrice: null, sortKey: null, sortDirection: null }

	if (!url) return result

	const queryString = `${url}`.includes('?') ? `${url}`.replace(/^.*?\?/, '') : `${url}`
	const filters = {}

	for (const pair of queryString.split('&')) {
		const separatorIndex = pair.indexOf('=')

		if (separatorIndex < 1) continue

		const name = decodeParam(pair.substring(0, separatorIndex)).toLowerCase()
		const value = decodeParam(pair.substring(separatorIndex + 1))

		if (name === 'filtro') {
			const [field, ...rest] = value.split('__')
			const filterValue = rest.join('__')

			if (!field || !filterValue) continue

			if (!filters[field]) filters[field] = []

			if (!filters[field].includes(filterValue)) filters[field].push(filterValue)
		} else if (name === 'precopor') {
			const [min, max] = value.split(';')

			result.minimumPrice = parsePrice(min)
			result.maximumPrice = parsePrice(max)
		} else if (name === 'ordenacao') {
			const [sortKey, sortDirection] = value.toUpperCase().split(':')

			// chave fora do enum ProductSortKeys faz a Wake recusar a query inteira
			if (!PRODUCT_SORT_TYPE[sortKey]) continue

			result.sortKey = sortKey
			result.sortDirection = SORT_DIRECTION[sortDirection] || null
		}
	}

	result.filter = Object.entries(filters).map(([field, values]) => ({ field, values }))

	return result
}
