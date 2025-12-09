export default function OrderSummaryCard(props) {
	const { order, ...rest } = props

	const coupon = order?.coupon

	const subtotal = {
		label: `Total dos itens: `,
		value: order?.subtotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
	}

	const freight = {
		label: 'Total do Frete: ',
		value:
			order?.shippingFee > 0
				? order?.shippingFee?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
				: 'Grátis'
	}

	// order?.discount vem como um numero negativo
	const discount =
		order?.discount !== 0
			? {
					label: 'Descontos: ',
					value: order?.discount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
				}
			: null

	const orderTotal = order?.total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

	return (
		<View {...rest}>
			<Text>Resumo:</Text>

			<View className='mt-1'>
				<View className='flex gap-1'>
					<Text className='text-xs'>{subtotal.label}</Text>
					<Text className='text-xs'>{subtotal.value}</Text>
				</View>

				{coupon && (
					<View className='flex gap-1'>
						<Text className='text-xs'>Cupom</Text>
						<Text className='text-xs'>{coupon}</Text>
					</View>
				)}

				<View className='flex gap-1'>
					<Text className='text-xs'>{freight.label}</Text>
					<Text className='text-xs'>{freight.value}</Text>
				</View>

				{discount && (
					<View className='flex gap-1'>
						<Text className='text-xs'>{discount.label}</Text>
						<Text className='text-xs'>{discount.value}</Text>
					</View>
				)}

				<View className='flex gap-1'>
					<Text className='text-xs font-medium'>Total:</Text>
					<Text className='text-xs font-medium'>{orderTotal}</Text>
				</View>
			</View>
		</View>
	)
}
