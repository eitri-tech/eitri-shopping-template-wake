export default function PurchasedProductsCard(props) {
	const { order, ...rest } = props

	return (
		<View
			className='flex flex-col gap-4'
			{...rest}>
			{order?.products?.map((product, index) => (
				<View
					key={product.productVariantId}
					className={`flex items-center gap-2 ${index > 0 ? 'border-t border-t-primary-700 pt-4' : 'pt-0'}`}>
					<View className='w-12 h-12'>
						<Image
							src={product.image}
							className='max-w-full max-h-full'
						/>
					</View>

					<View className='flex flex-col'>
						<Text className='text-xs'>{product.name}</Text>

						<Text className='text-xs'>
							{`${product.quantity} un ${product.salePrice.toLocaleString('pt-BR', {
								style: 'currency',
								currency: 'BRL'
							})}`}
						</Text>
					</View>
				</View>
			))}
		</View>
	)
}
