import { useState, useEffect } from 'react'
import { View, Image } from 'eitri-luminus'
import { getFavorites, addFavorite, removeFavorite } from '../../services/FavoriteService'
import { requestLogin } from '../../services/NavigationService'
import heart from '../../assets/images/favorite.svg'
import heartBorder from '../../assets/images/favorite_border.svg'
import { WishlistIcon } from 'shopping-wake-template-shared'

export default function FavoriteButton(props) {
	const { productId, productVariantId, productName, productPrice } = props

	const [isLoading, setIsLoading] = useState(false)
	const [isFavorite, setIsFavorite] = useState(false)

	useEffect(() => {
		verifyFavorite()
	}, [])

	const verifyFavorite = async () => {
		const favorites = await getFavorites().catch(() => null)
		if (favorites && favorites.includes(`${productId}`)) {
			setIsFavorite(true)
		}
	}

	const saveFavoriteProduct = async () => {
		setIsFavorite(!isFavorite)

		if (!isLoading) {
			setIsLoading(true)

			let favorites
			try {
				favorites = await getFavorites()
			} catch (e) {
				if (e.status === 401) {
					console.error('Login inválido, indo para o login')
					await flowLogin()
					setIsLoading(false)
					setIsFavorite(false)
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
			await addFavorite(productId, productVariantId, productName, productPrice)
		} catch (e) {
			if (e.status === 401) {
				console.error('Login inválido, indo para o login')
				await flowLogin()
				setIsFavorite(false)
				return
			}

			console.error(`Favorite ${productId}:`, e.message, e.status)
		}
	}

	const removeFavoriteProduct = async () => {
		setIsFavorite(false)
		try {
			await removeFavorite(productId)
		} catch (e) {
			if (e.status === 401) {
				console.error('Login inválido, indo para o login')
				await flowLogin()
				return
			}

			console.error(`Favorite ${productId}:`, e.message, e.status)
		}
	}

	const flowLogin = async () => {
		// abre app de Account
		try {
			await requestLogin()
		} catch (e) {
			console.error('flowLogin Error:', e)
		}
	}

	return (
		<View
			className='absolute z-10 right-1 top-1'
			onClick={saveFavoriteProduct}>
			<View className='flex items-center justify-center w-8 h-8 rounded-full bg-white/40 backdrop-blur-sm'>
				<WishlistIcon checked={isFavorite} />
			</View>
		</View>
	)
}
