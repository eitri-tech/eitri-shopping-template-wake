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
			productVariantId: product.productVariantId,
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
		
	let groups
	try {
		groups = await Wake.checkout.shippingQuoteGroups({
			checkoutId: checkout?.checkoutId
		})
	} catch (e) {
		console.log('getShippingQuotesImpl shippingQuoteGroups: ', e)
	}

	let physicalStores = []
	const hasPickUp = groups?.some(group => group.pickups)
	try {
		if (hasPickUp) {
			const shop = await Wake.store.shop()
			if (shop) {
				physicalStores = shop.physicalStores
			}
		}
	} catch (e) {
		console.log('getShippingQuotesImpl shop: ', e)
	}

	const formatedGroups = []

	groups?.map(group => {
		const delivery = []
		const pickup = []
		try {
			group.shippingQuotes?.map(quote => {
				delivery.push({
					id: quote.shippingQuoteId,
					name: quote.name,
					deliveryMessage: formatDeliveryMessage( quote.deadline, quote.deadlineInHours, false ),
					value: quote.value,
					formatedValue: quote.value === 0 ? 'Grátis' : formatCurrency(quote.value),
					isCurrent: checkout?.selectedShipping?.shippingQuoteId === quote.shippingQuoteId,
					type: quote.type,
					isPickup: false,
					pickUpStore: '',
					distributionCenterId: group.distributionCenter?.id
				})
			})
		} catch (e) {
			console.log('getShippingQuotesImpl group.shippingQuotes: ', e)
		}

		try {
			group.pickups?.map(pickupItem => {
				pickup.push({
					id: pickupItem.shippingQuoteId,
					name: pickupItem.name,
					deliveryMessage: formatDeliveryMessage( pickupItem.deadline, pickupItem.deadlineInHours, true ),
					value: pickupItem.value,
					formatedValue: pickupItem.value === 0 ? 'Grátis' : formatCurrency(pickupItem.value),
					isCurrent: checkout?.selectedShipping?.shippingQuoteId === pickupItem.shippingQuoteId,
					type: pickupItem.type,
					isPickup: true,
					pickUpStore: physicalStores.find(ps => ps.name === pickupItem.name),
					distributionCenterId: group.distributionCenter?.id
				})
			})
		} catch (e) {
			console.log('getShippingQuotesImpl group.pickups: ', e)
		}

		formatedGroups.push({
			delivery,
			pickup,
			products: group.products,
		})
	})

	return formatedGroups
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
		// const res = await Eitri.http.get(`https://pub-gateway.fbits.net/${checkoutId}`)
		const res = await Wake.checkout.paymentMethods()
		const resPayment = res?.data || res?.paymentMethods

		const payments = resPayment?.map(option => {
			return {
				name: option.Nome || option.name,
				paymentMethod: findPaymentMethod(option.Nome || option.name),
				paymentMethodId: option.Id || option.id,
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

	// const result = await Eitri.http.post(
	// 	`https://pub-gateway.fbits.net/api/pagamentos/loja/${optionId}/${checkoutId}`
	// )
	// return await Wake.cart.getCheckout()
	const result = await Wake.checkout.checkoutSelectPaymentMethod(optionId)
	return result?.checkoutSelectPaymentMethod || null
}

export const getOrderRevisionImpl = async option => {
	try {
		const checkout = await Wake.cart.getCheckout()

		let freight = []
		let payment = null
		let address = null

		const hasPickup = checkout?.selectedShippingGroups?.some(group => group?.selectedShipping?.type === 'Retirada')
		let shop
		if (hasPickup) {
			shop = await Wake.store.shop()
		}

		checkout?.selectedShippingGroups?.forEach((group, idx) => {
			const selectedShipping = group?.selectedShipping

			if (!selectedShipping) return

			const freightInfo = {}
			freightInfo.title = selectedShipping.name
			freightInfo.subtitle = formatDeliveryMessage(
				selectedShipping.deadline,
				selectedShipping.deadlineInHours,
				selectedShipping.type === 'Retirada'
			)

			if (selectedShipping.type === 'Retirada') {
				selectedShipping.isPickup = true
				
				const shopAddress = shop?.physicalStores?.find(ps => ps.name === selectedShipping.name)
				selectedShipping.address = {}
				selectedShipping.address.title = selectedShipping.name
				selectedShipping.address.subtitle = `${shopAddress?.address} - ${shopAddress?.neighborhood} - ${shopAddress?.city} - ${shopAddress?.state}`	
			} else {
				selectedShipping.isDelivery = true
				
				const selectedAddress = checkout?.selectedAddress
				if (selectedAddress && selectedAddress?.id) {
					selectedShipping.address = {}
					selectedShipping.address.title = selectedAddress.receiverName
					selectedShipping.address.subtitle = `${selectedAddress.street || ''}, ${selectedAddress.addressNumber || ''} - ${selectedAddress?.complement || ''} ${selectedAddress?.neighborhood || ''} ${selectedAddress?.neighborhood && '-'} ${selectedAddress?.city || ''} - ${selectedAddress?.state || ''} - CEP ${selectedAddress?.cep || ''}`
				}
				
			}

			freight.push({...freightInfo, ...selectedShipping})
		})

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

		return {
			payment,
			freight
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

export const setDeliveryOptionImpl = async deliveryOption => {
	return await Wake.checkout.checkoutSelectShippingQuote(deliveryOption.id, null, deliveryOption.distributionCenterId)
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
	// console.log('getTokenByGetNet', JSON.stringify(result))
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
