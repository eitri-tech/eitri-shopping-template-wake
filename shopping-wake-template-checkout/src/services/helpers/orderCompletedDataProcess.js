import { PAYMENT_METHODS, PAYMENT_METHODS_TITLE } from '../../utils/Constants'
import { getTotalizersImpl } from '../CheckoutServices'

export const orderCompletedDataProcess = orderData => {
	const { checkoutComplete } = orderData || {}
	const order = checkoutComplete?.orders?.[0] || {}
	const customer = checkoutComplete?.customer || {}
	const payment = order?.payment || {}
	const delivery = order?.delivery || {}
	const address = delivery?.address || {}
	const invoice = payment?.invoice || {}
	const paymentMethod = findPaymentMethod(payment.name)

	return {
		orderId: order.orderId || '',
		orderStatus: order.orderStatus || '',
		email: customer.email || '',
		paymentMethod,
		isPaid: false, // TODO: Verify if order is paid
		instantPaymentDetails: payment.pix
			? {
					qrCode: payment.pix.qrCode,
					qrCodeExpirationDate: payment.pix.qrCodeExpirationDate,
					qrCodeExpirationDateFormatted: convertDate(payment.pix.qrCodeExpirationDate),
					qrCodeUrl: payment.pix.qrCodeUrl
				}
			: null,
		billingDetails:
			paymentMethod === PAYMENT_METHODS.BILLING
				? {
						barcodeLine: invoice.digitableLine,
						billingDownloadUrl: invoice.paymentLink
					}
				: null,
		customer: {
			name: customer.customerName || '',
			document: customer.cpf || customer.cnpj || '',
			phone: customer.phoneNumber || ''
		},
		delivery: {
			type: delivery.name || '',
			sla: `Em até ${delivery.deliveryTime || 0} dias úteis`,
			fullAddress: `${address.address || ''}${address.complement ? `, ${address.complement}` : ''} - ${address.neighborhood || ''} - ${address.city || ''}`
		},
		payment: {
			type: paymentMethod,
			name: PAYMENT_METHODS_TITLE[paymentMethod] || '',
			info: paymentMethod === PAYMENT_METHODS.BILLING ? invoice.digitableLine : '',
			additionalInfo: ''
		},
		totalizers: getTotalizersImpl(checkoutComplete)
	}
}

function findPaymentMethod(name) {
	switch (name) {
		case 'Cartão':
			return PAYMENT_METHODS.CREDIT_CARD
		case 'PIX':
		case 'PIX 5% OFF':
			return PAYMENT_METHODS.INSTANT_PAYMENT
		case 'Boleto':
			return PAYMENT_METHODS.BILLING
		default:
			return ''
	}
}

function convertDate(isoString) {
	try {
		const date = new Date(isoString)

		// Adjusting time zone (UTC -3 to UTC -0)
		date.setHours(date.getHours() + 3)

		const day = String(date.getDate()).padStart(2, '0')
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const year = date.getFullYear()
		const hours = String(date.getHours()).padStart(2, '0')
		const minutes = String(date.getMinutes()).padStart(2, '0')

		return `${day}/${month}/${year} às ${hours}:${minutes}`
	} catch (error) {
		console.error('Error converting date:', error)
		return ''
	}
}
