import Eitri from 'eitri-bifrost'
import { Wake } from 'eitri-shopping-wake-shared'
import { PAYMENT_METHODS, PAYMENT_METHODS_TITLE } from '../utils/Constants'
import { orderCompletedDataProcess } from './helpers/orderCompletedDataProcess'
import { getCardBrand } from '../utils/CardUtil'
import { formatDeliveryMessage } from '../utils/formatDeliveryMessage'

export const getCheckout = async retrying => {
	try {
		const checkout = await Wake.cart.getCheckout()
		await addMetadata(checkout.checkoutId)

		return checkout
	} catch (e) {
		if (retrying) {
			throw e
		}
		const clonedCart = await Wake.checkout.checkoutClone()
		await Wake.cart.forceCartId(clonedCart.checkoutId)
		return getCheckout(true)
	}
}

export const startCheckoutImpl = async () => {
	const cart = await getCheckout()

	try {
		await Wake.checkout.checkoutPartnerAssociate()
	} catch (error) {
		console.log('Error checkoutPartnerAssociate', error)
	}

	if (cart?.orders?.length > 0) {
		throw new Error('cart.has.order')
	}

	if (!cart || cart.products?.length === 0) {
		throw new Error('empty.cart')
	}

	if (cart?.customer?.customerId) {
		return cart
	}

	try {
		const result = await Wake.checkout.checkoutCustomerAssociate()
		const newCart = result?.checkoutCustomerAssociate || result
		return newCart
	} catch (e) {
		const clonedCart = await Wake.checkout.checkoutClone()
		await Wake.cart.forceCartId(clonedCart.checkoutId)
		const result = await Wake.checkout.checkoutCustomerAssociate()
		const newCart = result?.checkoutCustomerAssociate || result
		console.log('novo carrinho gerado e associado ao usuário')
		return newCart
	}
}

export const addCouponToCheckout = async coupon => {
	try {
		const result = await Wake.checkout.checkoutAddCoupon(coupon.trim())
		return result?.checkoutAddCoupon
	} catch (error) {
		console.error('Erro ao adicionar cupom', error)
		return error
	}
}

export const removeCouponFromCheckout = async coupon => {
	try {
		const result = await Wake.checkout.checkoutRemoveCoupon(coupon.trim())
		return result?.checkoutRemoveCoupon
	} catch (error) {
		console.error('Erro ao remover cupom', error)
		throw error
	}
}

export const getTotalizersImpl = orderData => {
	const totalizers = {
		total: formatCurrency(orderData?.total),
		subtotal: formatCurrency(orderData?.subtotal),
		appliedCoupon: orderData?.coupon || null,
		discount: !orderData?.discount || orderData?.discount === 0 ? null : formatCurrency(orderData?.discount),
		couponDiscount:
			!orderData?.couponDiscount || orderData?.couponDiscount === 0
				? null
				: formatCurrency(orderData?.couponDiscount),
		totalDiscount:
			!orderData?.totalDiscount || orderData?.totalDiscount === 0
				? null
				: formatCurrency(orderData?.totalDiscount),
		paymentFees:
			!orderData?.paymentFees || orderData?.paymentFees === 0 ? null : formatCurrency(orderData?.paymentFees),
		items: []
	}

	orderData?.products?.forEach(product => {
		totalizers.items.push({
			image: product.imageUrl,
			label: product.name,
			value: formatCurrency(product.quantity * product.price)
		})
	})

	if (orderData?.selectedShipping) {
		const shippingValue = orderData.selectedShipping.value
		totalizers.shippingFee = shippingValue === 0 ? 'Grátis' : formatCurrency(shippingValue)
	}

	if (orderData?.checkingAccountActive && orderData?.checkingAccountValue !== 0) {
		totalizers.checkingAccountValue = formatCurrency(orderData?.checkingAccountValue)
	}

	return totalizers
}

export const getShippingQuotesImpl = async checkout => {
	try {
		const res = await Wake.checkout.shippingQuotes()

		const hasPickUp = res?.shippingQuotes?.some(quote => quote.type === 'Retirada')

		let physicalStores = []

		if (hasPickUp) {
			const shop = await Wake.store.shop()
			if (shop) {
				physicalStores = shop.physicalStores
			}
		}
		return res?.shippingQuotes?.map(quote => {
			console.log(formatDeliveryMessage(quote.deadline, quote.deadlineInHours, quote.type === 'Retirada'))
			return {
				id: quote.shippingQuoteId,
				name: quote.name,
				deliveryMessage: formatDeliveryMessage(
					quote.deadline,
					quote.deadlineInHours,
					quote.type === 'Retirada'
				),
				value: quote.value,
				formatedValue: quote.value === 0 ? 'Grátis' : formatCurrency(quote.value),
				isCurrent: checkout?.selectedShipping?.shippingQuoteId === quote.shippingQuoteId,
				type: quote.type,
				isPickup: quote.type === 'Retirada',
				pickUpStore: physicalStores.find(ps => ps.name === quote.name)
			}
		})
	} catch (e) {
		console.log('getShippingQuotes Error: ', e)
	}
}

const findPaymentMethod = name => {
	switch (name) {
		case 'Cartão':
			return PAYMENT_METHODS.CREDIT_CARD
		case 'CartaoTransparente':
			return PAYMENT_METHODS.CREDIT_CARD
		case 'Pix':
			return PAYMENT_METHODS.INSTANT_PAYMENT
		case 'PIX 5% OFF':
			return PAYMENT_METHODS.INSTANT_PAYMENT
		case 'Boleto':
			return PAYMENT_METHODS.BILLING
		case 'Vale - Compra':
			return PAYMENT_METHODS.CHECKING_ACCOUNT
		default:
			return ''
	}
}

export const getPaymentOptionsImpl = async checkoutId => {
	try {
		// const res = await Wake.checkout.paymentMethods()

		const res = await Eitri.http.get(`https://pub-gateway.fbits.net/${checkoutId}`)

		const payments = res?.data?.map(option => {
			return {
				name: option.Nome,
				paymentMethod: findPaymentMethod(option.Nome),
				paymentMethodId: option.Id,
				paymentMethodData: {}
			}
		})

		return payments
	} catch (e) {
		console.log(e)
		return []
	}
}

export const setPaymentOptionImpl = async (option, checkoutId) => {
	const optionId = option.paymentMethodId

	const result = await Eitri.http.post(
		`https://pub-gateway.fbits.net/api/pagamentos/loja/${optionId}/${checkoutId}`
	)
	return await Wake.cart.getCheckout()
	// return await Wake.checkout.checkoutSelectPaymentMethod(optionId)
}

export const getOrderRevisionImpl = async option => {
	try {
		const checkout = await Wake.cart.getCheckout()

		let freight = null
		let payment = null
		let address = null

		const selectedShipping = checkout?.selectedShipping
		if (selectedShipping && selectedShipping?.shippingQuoteId) {
			freight = {}
			freight.title = selectedShipping.name
			freight.subtitle = formatDeliveryMessage(
				selectedShipping.deadline,
				selectedShipping.deadlineInHours,
				selectedShipping.type === 'Retirada'
			)
		}

		const selectedPaymentMethod = checkout?.selectedPaymentMethod
		if (selectedPaymentMethod && selectedPaymentMethod?.paymentMethodId) {
			const installments = checkout?.selectedPaymentMethod?.installments
			payment = {}
			payment.title = PAYMENT_METHODS_TITLE[findPaymentMethod(selectedPaymentMethod.type)]
			payment.type = selectedPaymentMethod.type

			payment.subtitle = ''

			if (payment.title === 'Pix' && installments && installments.length > 0) {
				const pixInstallment = installments[0]

				if (pixInstallment.adjustment < 0) {
					const discount = Math.abs(pixInstallment.adjustment) * 100
					payment.subtitle = `${discount}% de desconto`
				} else if (pixInstallment.adjustment > 0) {
					const discountValue = pixInstallment.adjustment * pixInstallment.total
					payment.subtitle = `Desconto de R$ ${discountValue.toFixed(2)}`
				} else {
					payment.subtitle = ''
				}
			}
		}

		const isPickup = selectedShipping.type === 'Retirada'

		if (isPickup) {
			const shop = await Wake.store.shop()
			const shopAddress = shop?.physicalStores?.find(ps => ps.name === selectedShipping.name)
			address = {}
			address.title = selectedShipping.name
			address.subtitle = `${shopAddress?.address} - ${shopAddress?.neighborhood} - ${shopAddress?.city} - ${shopAddress?.state}`
		} else {
			const selectedAddress = checkout?.selectedAddress
			if (selectedAddress && selectedAddress?.id) {
				address = {}
				address.title = selectedAddress.receiverName
				address.subtitle = `${selectedAddress.street || ''}, ${selectedAddress.addressNumber || ''} - ${
					selectedAddress?.complement || ''
				} ${selectedAddress?.neighborhood || ''} ${selectedAddress?.neighborhood && '-'}
			${selectedAddress?.city || ''} - ${selectedAddress?.state || ''} - CEP ${selectedAddress?.cep || ''}`
			}
		}

		return {
			payment,
			freight,
			address
		}
	} catch (e) {
		console.error('Erro getOrderRevisionImpl', e)
	}
}

export const payOrderImpl = async (checkout, creditCardData, selectedPaymentOption, recaptchaToken) => {
	let checkoutData = {}
	const vendedorNome = checkout?.metadata?.find(m => m.key === 'VendedorNome')?.value || ''
	const vendedorCodigo = checkout?.metadata?.find(m => m.key === 'VendedorCodigo')?.value || ''

	let comments = ''
	if (vendedorCodigo || vendedorNome) {
		comments = `${vendedorCodigo ? `Vendedor Codigo: ${vendedorCodigo}` : ''}${
			vendedorCodigo && vendedorNome ? ', ' : ''
		}${vendedorNome ? `Vendedor Nome: ${vendedorNome}` : ''}`
	}

	if (selectedPaymentOption?.paymentMethod === PAYMENT_METHODS.CREDIT_CARD) {
		if (
			creditCardData &&
			creditCardData.number &&
			creditCardData.holderName &&
			creditCardData.expirationDate &&
			creditCardData.securityCode &&
			creditCardData.document
		) {
			checkoutData['number'] = creditCardData.number
			checkoutData['name'] = creditCardData.holderName
			checkoutData['month'] = creditCardData.expirationDate.split('/')[0]
			checkoutData['year'] = creditCardData.expirationDate.split('/')[1]
			checkoutData['expiry'] = creditCardData.expirationDate
			checkoutData['cvc'] = creditCardData.securityCode
			checkoutData['cpf'] = creditCardData.document

			// const paramsCreditCard = extractInputsHtml(checkout.selectedPaymentMethod?.html)
			// const numberToken = await getTokenByGetNet(creditCardData, paramsCreditCard)

			// checkoutData['getnet-fingerprint'] = `${creditCardData.document}_${checkout.checkoutId}`
			// checkoutData['getnet-accesstoken'] = paramsCreditCard['getnet-accesstoken']
			// checkoutData['getnet-sellerid'] = paramsCreditCard['getnet-sellerid']
			// checkoutData['bandeira'] = getCardBrand(creditCardData.number)
			// checkoutData['number_token'] = numberToken
			checkoutData['isSandbox'] = 'False'
			checkoutData['saveCard'] = false
			checkoutData['paymentType'] = 'Cartao'

			if (creditCardData.installments >= 1) {
				const checkoutInstallments = await Wake.checkout.checkoutSelectInstallment(
					checkout.selectedPaymentMethod.id,
					creditCardData.installments
				)
				if (
					checkoutInstallments.checkoutSelectInstallment.selectedPaymentMethod.selectedInstallment.number !==
					creditCardData.installments
				) {
					throw new Error('Invalid installment number')
				}
			}
		}
	}

	if (selectedPaymentOption?.paymentMethod === PAYMENT_METHODS.INSTANT_PAYMENT) {
		checkoutData['homologado'] = true
		checkoutData['paymentMethod'] = 'Pix'
	}

	if (recaptchaToken) {
		checkoutData['recaptchaToken'] = recaptchaToken
	}

	const res = await Wake.checkout.checkoutComplete(checkoutData, comments)

	return orderCompletedDataProcess(res)
}

export const deleteCart = async () => {
	try {
		await Wake.cart.clearCart()
	} catch (e) {
		console.log('Error deleting cart', e)
	}
}

function formatCurrency(value) {
	return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const setDeliveryOptionImpl = async deliveryOptionId => {
	return await Wake.checkout.checkoutSelectShippingQuote(deliveryOptionId)
}

export const setDeliveryAddressImpl = async address => {
	return await Wake.checkout.checkoutAddressAssociate(address.id)
}

export const useCheckingAccount = async checkoutId => {
	return await Wake.checkout.checkoutUseCheckingAccount(checkoutId)
}

export const checkoutReset = async checkoutId => {
	return await Wake.checkout.checkoutReset(checkoutId)
}

const getTokenByGetNet = async (creditCardData, paramsCreditCard) => {
	const getNetUrl = `https://api.getnet.com.br/v1/tokens/card`
	const result = await Eitri.http.post(
		getNetUrl,
		{
			customer_id: '',
			card_number: creditCardData.number.replace(/\D/g, '')
		},
		{
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Authorization': `Bearer ${paramsCreditCard['getnet-accesstoken']}`,
				'seller_id': paramsCreditCard['getnet-sellerid']
			}
		}
	)
	console.log('getTokenByGetNet', JSON.stringify(result))
	return result.data.number_token
}

const extractInputsHtml = htmlString => {
	const parser = new DOMParser()
	const doc = parser.parseFromString(htmlString, 'text/html')
	const inputs = doc.querySelectorAll('input')

	const result = {}
	inputs.forEach(input => {
		result[input.name] = input.value
	})

	return result
}

const addMetadata = async checkoutId => {
	try {
		const { applicationData } = await Eitri.getConfigs()
		const platform = applicationData?.platform === 'ios' ? 'eitri_ios' : 'eitri_android'
		const marketingTag = [{ key: 'platform', value: platform }]
		await Wake.checkout.addCheckoutMetadata(checkoutId, marketingTag)
	} catch (e) {
		console.error('Erro ao adicionar metadata', e)
	}
}
