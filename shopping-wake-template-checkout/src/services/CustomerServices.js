import { Wake } from 'eitri-shopping-wake-shared'
import Eitri from 'eitri-bifrost'

export const getCustomer = async () => {
	const result = await Wake.customer.getCustomer()
	if (!result) {
		throw new Error('user.not.logged')
	}
	return result?.customer
}

export const getAddressByZipCode = async zipCode => {
	const result = await Wake.customer.getAddressByZipCode(zipCode)
	return result
}

export const addAddressImpl = async address => {
	const _address = {
		addressNumber: address.number,
		addressDetails: address.complement,
		cep: address.cep,
		city: address.city,
		country: 'BR',
		receiverName: address.receiverName,
		referencePoint: address.referencePoint,
		neighborhood: address.neighborhood,
		phone: address.phone,
		state: address.state,
		address: address.street
	}

	const filteredAddress = Object.fromEntries(
		Object.entries(_address).filter(([_, value]) => value !== undefined && value !== null && value !== '')
	)

	await Wake.customer.createAddress(filteredAddress)
}

export const updateAddressImpl = async address => {
	const _address = {
		addressNumber: address.number,
		addressDetails: address.complement,
		cep: address.cep,
		city: address.city,
		country: 'BR',
		neighborhood: address.neighborhood,
		receiverName: address.receiverName,
		referencePoint: address.referencePoint,
		phone: address.phone,
		state: address.state,
		address: address.street
	}

	const filteredAddress = Object.fromEntries(
		Object.entries(_address).filter(([_, value]) => value !== undefined && value !== null && value !== '')
	)

	await Wake.customer.updateAddress(address.id, filteredAddress)
}

export const getUserAddressesImpl = async (customer, cart) => {
	if (!customer) return []
	if (!customer?.addresses) return []
	return customer?.addresses?.map(address => {
		return {
			id: address.id,
			title: address.receiverName,
			fullAddress: [
				address?.address
					? `${address?.address}${address?.addressNumber ? `, ${address?.addressNumber}` : ''}`
					: '',
				address?.addressDetails,
				address?.neighborhood,
				`${address?.city}, ${address?.state}`.trim(),
				address?.cep ? `CEP ${address?.cep}` : ''
			]
				.filter(part => part && part.trim())
				.join(' - '),
			isCurrentDeliveryAddress: cart?.selectedAddress?.id === address.id,
			addressNumber: address?.addressNumber,
			addressDetails: address.addressDetails,
			cep: address.cep,
			city: address.city,
			country: 'BR',
			receiverName: address.receiverName,
			referencePoint: address.referencePoint,
			neighborhood: address.neighborhood,
			phone: address.phone,
			state: address.state,
			address: address.address
		}
	})
}

export const removeAddressImpl = async address => {
	const addressId = address.id
	await Wake.customer.removeAddress(addressId)
}

export const isLoggedIn = async () => {
	const result = await Wake.customer.isLoggedIn()
	return result
}

export const requestLogin = () => {
	return new Promise((resolve, reject) => {
		Eitri.nativeNavigation.open({
			slug: 'account',
			initParams: { action: 'requestlogin', closeAppAfterLogin: true }
		})

		Eitri.navigation.setOnResumeListener(async () => {
			const isLogged = await Wake.customer.isLoggedIn()
			if (isLogged) {
				resolve()
			} else {
				reject()
			}
		})
	})
}

export const simpleLogin = async email => {
	return await Wake.customer.customerSimpleLoginStart(email)
}

export const customerSimpleLoginVerifyAnswer = async (email, questionId, answerId) => {
	return await Wake.customer.customerSimpleLoginVerifyAnwser(email, questionId, answerId)
}

export const customerCompletePartialRegistration = async (token, data) => {
	return await Wake.customer.customerCompletePartialRegistration(token, data)
}

export const isLoggedWithSimpleLogin = async () => {
	const result = await Wake.customer.getCustomerAccessTokenData()
	return result?.type === 'SIMPLE'
}
