import { PAYMENT_METHODS } from '../../utils/Constants'
import { useCheckout } from '../../providers/UseCheckout'
import CreditCard from './PaymentMethods/CreditCard'
import InstantPayment from './PaymentMethods/InstantPayment'
import Billing from './PaymentMethods/Billing'
import React, { useState, useEffect } from 'react'

export default function PaymentOptions(props) {
	const { getPaymentOptions } = useCheckout()
	const [payments, setPayments] = useState([])
	const [loading, setLoading] = useState(true)

	const paymentsMap = {
		[PAYMENT_METHODS.CREDIT_CARD]: CreditCard,
		[PAYMENT_METHODS.INSTANT_PAYMENT]: InstantPayment,
		[PAYMENT_METHODS.BILLING]: Billing
	}

	useEffect(() => {
		getPaymentOptions().then(paymentOptions => {
			setLoading(false)
			setPayments(paymentOptions)
		})
	}, [])

	const getPaymentOptionComponent = option => {
		let paymentMethod = option.paymentMethod
		if (!paymentsMap[paymentMethod]) {
			if (option?.name?.toLowerCase().includes('cartão') || option?.name?.toLowerCase().includes('card')) {
				paymentMethod = PAYMENT_METHODS.CREDIT_CARD
			} else if (option?.name?.toLowerCase().includes('pix')) {
				paymentMethod = PAYMENT_METHODS.INSTANT_PAYMENT
			} else if (option?.name?.toLowerCase().includes('boleto')) {
				paymentMethod = PAYMENT_METHODS.BILLING
			}
		}
		const Implementation = paymentsMap[paymentMethod]
		if (!Implementation) return null
		return React.createElement(Implementation, {
			key: option.paymentMethodId,
			paymentOption: option
		})
	}

	return (
		<View className='px-4'>
			<Text className='mb-4 text-sm font-medium block'>Formas de Pagamento</Text>

			<View className='flex flex-col gap-4'>
				{loading ? (
					<View className='flex w-screen justify-center'>
						<Loading />
					</View>
				) : (
					<>{payments?.map(payment => getPaymentOptionComponent(payment))}</>
				)}
			</View>
		</View>
	)
}
