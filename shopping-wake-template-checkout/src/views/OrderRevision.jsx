import Eitri from 'eitri-bifrost'
import {
	HeaderContentWrapper,
	HeaderReturn,
	LoadingComponent,
	CustomButton,
	BottomInset
} from 'shopping-wake-template-shared'
import StepIndicator from '../components/StepIndicator/StepIndicator'
import OrderSummary from '../components/OrderSummary/OrderSummary'
import { useCheckout } from '../providers/UseCheckout'
import OrderRevisionComponent from '../components/OrderRevision/OrderRevisionComponent'
import BottomFixed from '../components/BottomFixed/BottomFixed'
import { logScreenView, sendLogError } from '../services/TrackingService'
import ModalErrorPayment from '../components/ModalErrorPayment/ModalErrorPayment'
import { useEffect, useState } from 'react'

export default function OrderRevision(props) {
	const PAGE = 'Checkout - Revisão do Pedido'

	const { payOrder, customer, checkout } = useCheckout()
	const [loadingPayment, setLoadingPayment] = useState(false)
	const [showError, setShowError] = useState(false)

	useEffect(() => {
		logScreenView(PAGE, 'OrderRevision')
	}, [])

	const handlePay = async () => {
		setLoadingPayment(true)
		try {
			await payOrder()
			Eitri.navigation.navigate({ path: 'OrderCompleted', reset: true })
		} catch (e) {
			console.error('Error paying order', e)

			sendLogError(e, '[OrderRevision]handlePay', {
				userEmail: customer.email,
				cartId: checkout.checkoutId
			})
			setShowError(true)
		}
		setLoadingPayment(false)
	}

	const closeModalError = () => {
		setShowError(false)
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			<LoadingComponent
				fullScreen
				isLoading={loadingPayment}
			/>

			<View className='flex flex-col gap-6'>
				<StepIndicator currentStep={3} />

				<OrderSummary className='px-4' />

				<OrderRevisionComponent />

				<BottomFixed>
					<CustomButton
						wide
						onClick={handlePay}
						label='Finalizar Compra'
					/>
				</BottomFixed>
			</View>

			<ModalErrorPayment
				showModal={showError}
				closeModal={closeModalError}
			/>

			<BottomInset />
		</Page>
	)
}
