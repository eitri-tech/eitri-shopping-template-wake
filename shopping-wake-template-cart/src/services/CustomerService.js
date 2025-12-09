import { Wake } from 'eitri-shopping-wake-shared'
import { removeItemFromArray } from 'src/utils/Util'
import StorageService from './StorageService'

const WISHLIST = 'wishlist'

export const checkWishlistItem = async productVariantId => {
	let _wishlist = await StorageService.getStorageItem(WISHLIST)
	if (_wishlist) {
		let wishlist = JSON.parse(_wishlist)
		const index = wishlist.indexOf(productVariantId)
		if (index !== -1) {
			return true
		}
	}
	return false
}

export const removeItemFromWishlist = async productVariantId => {
	let _wishlist = await StorageService.getStorageItem(WISHLIST)
	if (_wishlist) {
		let wishlist = JSON.parse(_wishlist)
		const newWishList = removeItemFromArray(wishlist, productVariantId)
		await StorageService.setStorageItem(WISHLIST, JSON.stringify(newWishList))
	}
}

export const addToWishlist = async productVariantId => {
	let _wishlist = await StorageService.getStorageItem(WISHLIST)
	let wishlist = _wishlist ? JSON.parse(_wishlist) : []
	wishlist.push(productVariantId)
	await StorageService.setStorageItem(WISHLIST, JSON.stringify(wishlist))
}

export const isLoggedIn = async () => {
	try {
		return await Wake.customer.isLoggedIn()
	} catch (error) {
		console.error('Erro ao verificar se está logado', error)
		throw error
	}
}
