import { HeaderContentWrapper, LoadingComponent, HeaderReturn } from 'shopping-wake-template-shared'
import StepIndicator from '../components/StepIndicator/StepIndicator'
import OrderSummary from '../components/OrderSummary/OrderSummary'
import DeliveryAddressSelector from '../components/DeliveryAddressSelector/DeliveryAddressSelector'
import { Wake } from 'eitri-shopping-wake-shared'
import { useCheckout } from '../providers/UseCheckout'
import { isLoggedIn, requestLogin } from '../services/CustomerServices'
import Eitri from 'eitri-bifrost'
import { sendGaBeginCheckout, logScreenView } from '../services/TrackingService'
import { forceCartId } from '../services/CartService'
import { delay } from '../utils/Util'
import GenericModal from '../components/GenericModal/GenericModal'
import { checkoutReset } from '../services/CheckoutServices'

export default function Home(props) {
	const PAGE = 'Checkout'

	const { checkout, startCheckout } = useCheckout()
	const [isLoading, setIsLoading] = useState(false)
	const [showModalError, setShowModalError] = useState(false)
	const [isPristine, setIsPristine] = useState(true)

	useEffect(() => {
		init()
		logScreenView(PAGE, 'Checkout')
	}, [])

	useEffect(() => {
		if (checkout && isPristine) {
			try {
				sendGaBeginCheckout(checkout)
				setIsPristine(false)
			} catch (e) {
				console.error('Error sending ga begin checkout', e)
			}
		}
	}, [checkout])

	const closeModalError = async () => {
		setShowModalError(false)
		setIsLoading(true)
		await wakeConfigure()
		setIsLoading(false)
	}

	const closeApp = async () => {
		await Eitri.close()
	}

	const init = async () => {
		await wakeConfigure()

		// await Wake.customer.logout()
		// await Wake.cart.generateNewCart()
		//
		// Eitri.navigation.navigate({ path: 'OrderCompleted', replace: true })
		// return

		const userIsLoggedIn = await isLoggedIn()

		const initialInfos = await Eitri.getInitializationInfos()

		if (initialInfos?.cartId) {
			await forceCartId(initialInfos?.cartId)
		}

		if (!userIsLoggedIn) {
			try {
				await requestLogin()
			} catch (e) {
				Eitri.navigation.navigate({ path: 'UnloggedError', replace: true })
				return
			}
		}

		await startCheckout()
	}

	const wakeConfigure = async (attempts = 0) => {
		if (attempts > 3) {
			setShowModalError(true)
			return
		}

		try {
			await Wake.tryAutoConfigure({ verbose: true, gaVerbose: false })
		} catch (e) {
			console.error('Error configuring wake', e)
			await delay(1000)
			return wakeConfigure(attempts + 1)
		}

		if (checkout?.checkoutId) {
			try {
				await checkoutReset(checkout.checkoutId)
			} catch (e) {
				console.error('Error wakeConfigure checkoutReset', e)
			}
		}
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			<LoadingComponent
				fullScreen={true}
				isLoading={isLoading}
			/>

			{!isLoading && (
				<View className='flex flex-col gap-6'>
					<StepIndicator currentStep={1} />
					<OrderSummary className='px-4' />
					<DeliveryAddressSelector className='px-4' />
				</View>
			)}

			<GenericModal
				showModal={showModalError}
				closeModal={closeModalError}
				title={'Ocorreu uma falha ao processar sua sacola'}
				description={'Por favor, tente novamente mais tarde.'}
				buttonLabel={'Tentar novamente'}
				onClick={closeModalError}
				secondaryButtonLabel={'Voltar'}
				secondaryonClick={closeApp}
			/>
		</Page>
	)
}
