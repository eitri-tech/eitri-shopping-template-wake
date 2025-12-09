import { useState, useEffect } from 'react'
import { View, Image } from 'eitri-luminus'
import { logEvent } from '../../services/TrackingService'
import { getFavorites, addFavorite, removeFavorite } from '../../services/FavoriteService'
import { requestLogin } from '../../services/NavigationService'
import { WishlistIcon } from 'shopping-wake-template-shared'

export default function FavoriteButton(props) {
	const { productId, productVariantId, productName, productPrice, disableAbsolutePosition = false, className } = props

	const [isLoading, setIsLoading] = useState(false)
	const [isFavorite, setIsFavorite] = useState(false)

	useEffect(() => {
		verifyFavorite()
	}, [])

	const verifyFavorite = async () => {
		try {
			const favorites = await getFavorites()
			const isFav = favorites && favorites.includes(`${productId}`)
			setIsFavorite(isFav)
		} catch (error) {
			setIsFavorite(false)
		}
	}

	const saveFavoriteProduct = async () => {
		if (!isLoading) {
			setIsLoading(true)

			let favorites
			try {
				favorites = await getFavorites()
			} catch (e) {
				if (e.status === 401) {
					await flowLogin()
					setIsLoading(false)
					return
				}
			}
			if (favorites.includes(`${productId}`)) {
				await removeFavoriteProduct()
			} else {
				await addFavoriteProduct()
			}

			setIsLoading(false)
		}
	}

	const addFavoriteProduct = async () => {
		setIsFavorite(true)
		try {
			await addFavorite(productId)

			logEvent('add_to_wishlist', {
				currency: 'BRL',
				value: productPrice || 0,
				items: [{ item_id: productId, item_name: productName || '', item_variant: productVariantId || '' }]
			})
		} catch (e) {
			console.log('Erro ao adicionar favorito:', e)
			if (e.status === 401) {
				await flowLogin()
				return
			}
		}
	}

	const removeFavoriteProduct = async () => {
		setIsFavorite(false)
		try {
			await removeFavorite(productId)
		} catch (e) {
			if (e.status === 401) {
				await flowLogin()
				return
			}
		}
	}

	const flowLogin = async () => {
		// abre app de Account
		try {
			await requestLogin()
		} catch (e) {}
	}

	return (
		<View
			className={className}
			onClick={saveFavoriteProduct}>
			<WishlistIcon checked={isFavorite} />
		</View>
	)
}
