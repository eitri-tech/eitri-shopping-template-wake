import {
	addCouponToCheckout,
	getOrderRevisionImpl,
	getPaymentOptionsImpl,
	getShippingQuotesImpl,
	getTotalizersImpl,
	payOrderImpl,
	removeCouponFromCheckout,
	setDeliveryAddressImpl,
	setDeliveryOptionImpl,
	setPaymentOptionImpl,
	startCheckoutImpl,
	getCheckout,
	useCheckingAccount,
	checkoutReset
} from '../services/CheckoutServices'
import {
	addAddressImpl,
	updateAddressImpl,
	getCustomer,
	getUserAddressesImpl,
	removeAddressImpl
} from '../services/CustomerServices'
import Eitri from 'eitri-bifrost'
import { formatCurrency } from '../utils/Util'
import { sendLogError } from '../services/TrackingService'

const Checkout = createContext({})

export default function CheckoutProvider({ children }) {
	const [checkout, setCheckout] = useState()
	const [customer, setCustomer] = useState(null)
	const [loading, setLoading] = useState(true)
	const [selectedPaymentOption, setSelectedPaymentOption] = useState(null)
	const [order, setOrder] = useState()
	const [creditCardData, setCreditCardData] = useState({})

	const startCheckout = async () => {
		try {
			setLoading(true)

			const customer = await getCustomer()
			const checkout = await startCheckoutImpl()

			setCustomer(customer)
			setCheckout(checkout)
			setLoading(false)
		} catch (error) {
			console.error('Error starting checkout:', error)
			if (error.message === 'cart.has.order') {
				Eitri.navigation.navigate({ path: 'CheckoutAlreadyPaidError', replace: true })
				return
			}
			if (error.message === 'empty.cart') {
				Eitri.navigation.navigate({ path: 'EmptyCartError', replace: true })
				return
			}
			Eitri.navigation.navigate({ path: 'GenericError', replace: true })
			sendLogError(error, '[CheckoutProvider]startCheckout')
		}
	}

	const loadCustomer = async () => {
		const customer = await getCustomer()
		setCustomer(customer)
	}

	const getTotalizers = async () => {
		if (!checkout) return []
		return getTotalizersImpl(checkout)
	}

	const getUserAddresses = async () => {
		if (!customer) return []
		return await getUserAddressesImpl(customer, checkout)
	}

	const setDeliveryAddress = async address => {
		const result = await setDeliveryAddressImpl(address)
		setCheckout(result.checkoutAddressAssociate)
	}

	const addAddress = async address => {
		await addAddressImpl(address)
	}

	const updateAddress = async address => {
		await updateAddressImpl(address)
	}

	const removeAddress = async address => {
		await removeAddressImpl(address)
	}

	const getShippingQuotes = async () => {
		if (!customer) return []
		return await getShippingQuotesImpl(checkout)
	}

	const getPaymentOptions = async () => {
		return await getPaymentOptionsImpl(checkout.checkoutId)
	}

	const setPaymentOption = async paymentOption => {
		setLoading(true)
		const result = await setPaymentOptionImpl(paymentOption, checkout.checkoutId)
		setCheckout(result)
		setSelectedPaymentOption(paymentOption)
		setLoading(false)
	}

	const getOrderRevision = async () => {
		return await getOrderRevisionImpl()
	}

	const payOrder = async recaptchaToken => {
		const _order = await payOrderImpl(checkout, creditCardData, selectedPaymentOption, recaptchaToken)
		console.log('Order:', _order)
		setOrder(_order)
	}

	const setDeliveryOption = async deliveryOptionId => {
		const result = await setDeliveryOptionImpl(deliveryOptionId)
		// TODO: realizar passagem do token de usuário para receber completo - ajuste no Service tambem
		setCheckout({ ...result.checkoutSelectShippingQuote, customer: checkout.customer })
	}

	const getInstallments = async () => {
		if (checkout && checkout.selectedPaymentMethod && checkout.selectedPaymentMethod.installments) {
			return checkout.selectedPaymentMethod.installments.map(installment => ({
				number: installment.number,
				value: installment.value,
				formatedValue: formatCurrency(installment.value),
				total: installment.total,
				formatedTotal: formatCurrency(installment.total)
			}))
		} else {
			return []
		}
	}

	const addCoupon = async coupon => {
		try {
			const response = await addCouponToCheckout(coupon)
			if (response.coupon) {
				setCheckout(response)
			}
			return response
		} catch (error) {
			console.error('Error addCoupon:', error)
			return error
		}
	}

	const removeCoupon = async coupon => {
		try {
			const response = await removeCouponFromCheckout(coupon)
			setCheckout(response)
		} catch (error) {
			console.error('Error removeCoupon:', error)
			throw error
		}
	}

	const getCouponInfo = () => {
		return {
			coupon: checkout?.coupon,
			couponDiscount: checkout?.couponDiscount || 0
		}
	}

	const addCheckingAccount = async () => {
		try {
			const response = await useCheckingAccount(checkout.checkoutId)
			if (response?.checkoutUseCheckingAccount) {
				setCheckout(response?.checkoutUseCheckingAccount)
			}
			return response
		} catch (error) {
			console.error('Error addCheckingAccount:', error)
			return error
		}
	}

	const removeCheckingAccount = async () => {
		try {
			const response = await checkoutReset(checkout.checkoutId)
			const _checkout = await getCheckout()
			setCheckout(_checkout)
		} catch (error) {
			console.error('Error removeCheckingAccount:', error)
			return error
		}
	}

	return (
		<Checkout.Provider
			value={{
				checkout,
				customer,
				loading,
				selectedPaymentOption,
				order,
				startCheckout,
				getTotalizers,
				getUserAddresses,
				setDeliveryAddress,
				addAddress,
				updateAddress,
				removeAddress,
				getShippingQuotes,
				getPaymentOptions,
				setPaymentOption,
				getOrderRevision,
				payOrder,
				setDeliveryOption,
				getInstallments,
				creditCardData,
				setCreditCardData,
				addCoupon,
				removeCoupon,
				getCouponInfo,
				addCheckingAccount,
				removeCheckingAccount,
				loadCustomer
			}}>
			{children}
		</Checkout.Provider>
	)
}

export function useCheckout() {
	const context = useContext(Checkout)
	return context
}
