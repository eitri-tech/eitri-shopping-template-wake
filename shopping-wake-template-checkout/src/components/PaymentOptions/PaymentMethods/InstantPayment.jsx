import PaymentMethodCard from './PaymentMethodCard'
import { useCheckout } from '../../../providers/UseCheckout'
import Eitri from 'eitri-bifrost'

export default function InstantPayment(props) {
	const { setPaymentOption } = useCheckout()

	const { paymentOption } = props

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
			title={'Pix'}
			alertMsg={'O código Pix será exibido na próxima etapa, após a revisão do seu pedido.'}
			subtitle={'Pagamento instantâneo'}
			onClick={handlePress}
		/>
	)
}
