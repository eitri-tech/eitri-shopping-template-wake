import Eitri from 'eitri-bifrost'
import {
	HeaderContentWrapper,
	HeaderReturn,
	LoadingComponent,
	BottomInset,
	CustomButton
} from 'shopping-wake-template-shared'
import StepIndicator from '../components/StepIndicator/StepIndicator'
import OrderSummary from '../components/OrderSummary/OrderSummary'
import Coupon from '../components/Coupon/Coupon'
import { useCheckout } from '../providers/UseCheckout'
import PaymentOptions from '../components/PaymentOptions/PaymentOptions'
import { logScreenView, sendLogError } from '../services/TrackingService'
import CheckingAccountCard from '../components/CheckingAccountCard/CheckingAccountCard'
import BottomFixed from '../components/BottomFixed/BottomFixed'
import { getPaymentOptionsImpl } from '../services/CheckoutServices'
import { useEffect, useState } from 'react'

export default function Payment(props) {
	const PAGE = 'Checkout - Formas de Pagamento'

	const { checkout, setPaymentOption, loading, customer } = useCheckout()

	const [loadingCheckingAccount, setLoadingCheckingAccount] = useState(false)
	const [showCoupon, setShowCoupon] = useState(false)

	useEffect(() => {
		validateCheckout()
		logScreenView(PAGE, 'Payment')
	}, [])

	useEffect(() => {
		if (customer) {
			try {
				// identificar se é colaborador
				const isPartner = customer?.partners?.some(partner => partner?.name?.toLowerCase() === 'colaboradores')

				// se for colaborador, não alterar state
				if (isPartner) return
			} catch (e) {
				console.error('Error isPartner', e)
			}
			setShowCoupon(true)
		}
	}, [customer])

	const validateCheckout = () => {
		if (!checkout?.selectedShipping) {
			Eitri.navigation.navigate({ path: 'Home' })
		}
	}

	const handlePress = async () => {
		try {
			setLoadingCheckingAccount(true)
			const paymentOptions = await getPaymentOptionsImpl()
			if (paymentOptions.length > 0) {
				await setPaymentOption(paymentOptions[0])
				Eitri.navigation.navigate({ path: 'OrderRevision' })
			}
			setLoadingCheckingAccount(false)
		} catch (e) {
			sendLogError(e, '[Payment]handlePress', {
				userEmail: customer?.email,
				cartId: checkout?.checkoutId
			})
		}
	}

	return (
		<Page title={PAGE}>
			<LoadingComponent
				fullScreen
				isLoading={loading || loadingCheckingAccount}
			/>

			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			<View className='flex flex-col gap-6'>
				<StepIndicator currentStep={2} />

				<OrderSummary className={'px-4'} />

				{showCoupon && <Coupon />}

				<CheckingAccountCard />

				{checkout?.total > 0 ? (
					<PaymentOptions />
				) : (
					<BottomFixed>
						<CustomButton
							wide
							onClick={handlePress}
							label='Confirmar Compra'
						/>
					</BottomFixed>
				)}

				<BottomInset />
			</View>
		</Page>
	)
}
