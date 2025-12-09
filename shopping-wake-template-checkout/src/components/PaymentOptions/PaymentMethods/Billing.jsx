import PaymentMethodCard from './PaymentMethodCard'
import { useCheckout } from '../../../providers/UseCheckout'
import Eitri from 'eitri-bifrost'

export default function Billing(props) {
	const { paymentOption } = props
	const { setPaymentOption } = useCheckout()

	const handlePress = async () => {
		try {
			await setPaymentOption(paymentOption)
			Eitri.navigation.navigate({ path: 'OrderRevision' })
		} catch (e) {
			console.error('Error setting payment option:', e)
		}
	}

	return (
		<PaymentMethodCard
			title={'Boleto Bancário'}
			onClick={handlePress}
		/>
	)
}
