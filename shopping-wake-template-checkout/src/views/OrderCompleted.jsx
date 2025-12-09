import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderReturn, BottomInset } from 'shopping-wake-template-shared'
import OrderSummary from '../components/OrderSummary/OrderSummary'
import { useCheckout } from '../providers/UseCheckout'
import { PAYMENT_METHODS } from '../utils/Constants'
import OrderCompletedInfo from '../components/OrderCompletedInfo/OrderCompletedInfo'
import OrderCompleteInstantPaymentInfo from '../components/OrderCompleteInstantPaymentInfo/OrderCompleteInstantPaymentInfo'
import OrderCompletedDetails from '../components/OrderCompletedDetails/OrderCompletedDetails'
import { logScreenView } from '../services/TrackingService'
import OrderCompleteBillingInfo from '../components/OrderCompleteBillingInfo/OrderCompleteBillingInfo'
import { useEffect } from 'react'

export default function OrderCompleted(props) {
	const { order } = useCheckout()

	const PAGE = 'Pedido concluído'

	useEffect(() => {
		logScreenView(PAGE, 'OrderCompleted')
		requestAppReview()

		Eitri.navigation.addBackHandler(Eitri.exposedApis.appState.goHome)
	}, [])

	const requestAppReview = async () => {
		try {
			await Eitri.appStore.requestInAppReview()
			console.log('Solicitação de avaliação enviada com sucesso!')
		} catch (error) {
			console.error('Erro ao solicitar avaliação do app:', error)
		}
	}

	return (
		<Page
			bottomInset
			topInset
			title={PAGE}>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>
			<View className='flex flex-col gap-6 p-4'>
				<OrderCompletedInfo />

				{order?.paymentMethod === PAYMENT_METHODS.INSTANT_PAYMENT && <OrderCompleteInstantPaymentInfo />}

				{order?.paymentMethod === PAYMENT_METHODS.BILLING && <OrderCompleteBillingInfo />}

				<OrderCompletedDetails />

				<OrderSummary totalizers={order?.totalizers} />

				<BottomInset />
			</View>
		</Page>
	)
}
