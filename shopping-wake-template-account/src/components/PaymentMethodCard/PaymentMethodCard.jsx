export default function PaymentMethodCard(props) {
	const { order, ...rest } = props

	const formatMaskedCard = maskedNumber => {
		return maskedNumber.replace(/\*/g, '').replace(/(\d{4})$/, '$1')
	}

	const formatAmountInCents = amount => {
		if (typeof amount !== 'number') {
			return ''
		}

		if (amount === 0) {
			return 'Grátis'
		}

		return amount.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
	}

	const payments = order?.payments?.map(payment => {
		let methodName = ''
		let brandCard = null
		let maskedNumberCard = null

		if (payment.pix) {
			methodName = 'Pix'
		} else if (payment.boleto) {
			methodName = 'Boleto Bancário'
		} else if (payment.card) {
			methodName = 'Cartão de crédito'
			brandCard = payment.card.brand
			maskedNumberCard = formatMaskedCard(payment.card.maskedNumber)
		}

		return {
			methodName,
			brandCard,
			maskedNumberCard,
			installments: payment.installments
		}
	})

	return (
		<View {...rest}>
			<Text>Forma de pagamento:</Text>

			<View className='mt-1'>
				{payments?.map((payment, index) => (
					<View
						key={index}
						className='flex flex-col gap-[2px]'>
						<Text
							key={index}
							className='text-xs'>
							{`${
								payment.brandCard
									? `${payment.brandCard} ${formatAmountInCents(order?.total)} (${
											payment?.installments
										}x)`
									: payment.methodName
										? `${payment.methodName}`
										: ''
							}`}
							{/* {`${payment.brandCard || payment.methodName}${
								payment.methodName
									? ''
									: ` ${formatAmountInCents(order?.total)} (${payment?.installments}x)`
							}`} */}
						</Text>

						{payment.brandCard && payment.maskedNumberCard && (
							<Text className='text-xs'>{`Cartão com final ${payment.maskedNumberCard}`}</Text>
						)}
					</View>
				))}
			</View>
		</View>
	)
}
