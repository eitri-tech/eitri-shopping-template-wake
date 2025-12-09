import { useState, useEffect } from 'react'
import { View } from 'eitri-luminus'
import { getProductRecommendations } from '../../services/ProductService'
import ProductCard from '../ProductCard/ProductCard'

export default function ProductRecommendation(props) {
	const { product } = props

	const [products, setProducts] = useState([])

	useEffect(() => {
		loadRecommendation(product.productId)
	}, [])

	const loadRecommendation = async productId => {
		try {
			const products = await getProductRecommendations(productId)
			setProducts(products)
		} catch (e) {
			console.error('Erro on get recommendation:')
		}
	}

	return (
		<View className='flex overflow-x-scroll gap-2 mx-4'>
			{products.map(product => (
				<ProductCard
					key={product.productId}
					product={product}
					className='w-[60vw] shrink-0'
					showFavoriteIcon={true}
					showProductInfo={true}
					disableImageScroll={true}
				/>
			))}
		</View>
	)
}
