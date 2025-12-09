import { Wake } from 'eitri-shopping-wake-shared'
import { logEvent } from './TrackingService'

// local estático
let favoriteList

export const startFavorites = async () => {
	try {
		return getCustomerFavorites()
	} catch (e) {
		console.error(`startFavorites Error:`, e)
	}

	return []
}

export const resetFavorites = () => {
	favoriteList = undefined
}

export const addFavorite = async (productId, name, sku, price) => {
	const result = await Wake.customer.addWishlistProduct(productId)
	if (result) {
		const favorites = result.map(f => `${f.productId}`)
		// console.log('result WAKE addFavorite', favorites)
		favoriteList = favorites

		logEvent('add_to_wishlist', {
			currency: 'BRL',
			value: price || 0,
			items: [{ item_id: productId, item_name: name, item_variant: sku || '' }]
		})

		return favorites
	}

	return []
}

export const removeFavorite = async productId => {
	const result = await Wake.customer.removeWishlistProduct(productId)
	if (result) {
		const favorites = result.map(f => `${f.productId}`)
		// console.log('result WAKE removeFavorite', favorites)
		favoriteList = favorites
		return favorites
	}

	return []
}

export const getFavorites = async () => {
	if (favoriteList === undefined) {
		// console.log('buscando na WAKE')
		const favorites = await getCustomerFavorites()
		return favorites
	}

	// console.log('Retornando favorites local', favoriteList)
	return favoriteList
}

let promiseGetFavorites
const getCustomerFavorites = async () => {
	const result = await getWakeWishList().catch(e => {
		promiseGetFavorites = undefined
		throw e
	})
	promiseGetFavorites = undefined

	if (result) {
		const favorites = result.map(f => `${f.productId}`)
		favoriteList = favorites
		// console.log('retorno WAKE', favorites)
		return favorites
	}

	// console.log('retorno WAKE: vazio')
	return []
}

const getWakeWishList = () => {
	if (promiseGetFavorites) {
		return promiseGetFavorites
	}
	promiseGetFavorites = new Promise((resolve, reject) => {
		// console.log('get na  WAKE favorites', new Date().toISOString() )
		Wake.customer
			.getWishList()
			.then(favorites => resolve(favorites))
			.catch(e => reject(e))
	})
	return promiseGetFavorites
}
