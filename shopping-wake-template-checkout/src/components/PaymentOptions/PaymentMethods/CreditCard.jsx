import PaymentMethodCard from './PaymentMethodCard'
import Eitri from 'eitri-bifrost'
import { useCheckout } from '../../../providers/UseCheckout'

export default function CreditCard(props) {
	const { setPaymentOption } = useCheckout()

	const { paymentOption } = props

	const handlePress = async () => {
		try {
			await setPaymentOption(paymentOption)
			Eitri.navigation.navigate({ path: 'AddCard' })
		} catch (e) {
			console.error('Error setting payment option:', e)
		}
	}

	return (
		<PaymentMethodCard
			title={paymentOption.title || 'Cartão de crédito'}
			subtitle={paymentOption.subtitle || 'Adicionar novo cartão'}
			onClick={handlePress}
		/>
	)
}
