import Eitri from 'eitri-bifrost'
import { Wake } from 'eitri-shopping-wake-shared'
import { PERSON_TYPE } from '../utils/Constants'
import {
	validateCNPJ,
	validateCPF,
	validateDate,
	validateFullName,
	validateGender,
	validatePasswordConfirmation,
	validatePhone,
	validateString,
	validateTotalDigits
} from './ValidateService'
import { delay } from '../utils/Util'

/**
 * Realiza o login do usuário.
 * @param {string} userLogin - CPF ou email do usuário.
 * @param {string} password - Senha do usuário.
 * @returns {<Object>} Retorna um objeto contendo os dados do usuário.
 */
export const doLogin = async (userLogin, password) => {
	return await Wake.customer.customerAuthenticatedLogin(userLogin, password)
}

/**
 * Realiza o logout do usuário.
 * @returns {} Não tem retorno
 */
export const doLogout = async () => {
	return await Wake.customer.logout()
}

export async function loginWithEmailAndKey(email, verificationCode) {
	// return await Vtex.customer.loginWithEmailAndAccessKey(email, verificationCode)
}

export async function sendAccessKeyByEmail(email) {
	// return await Vtex.customer.sendAccessKeyByEmail(email)
}

export const isLoggedIn = async () => {
	return await Wake.customer.isLoggedIn()
}

export const getSavedUser = async () => {
	// return await Vtex.customer.retrieveCustomerData()
}

export const sendPasswordResetCode = async userEmail => {
	// return await Vtex.customer.sendAccessKeyByEmail(userEmail)
}

export const sendPassword = async (email, accessKey, newPassword) => {
	// return await Vtex.customer.setPassword(email, accessKey, newPassword)
}

export const getCustomer = async () => {
	const result = await Wake.customer.getCustomer()
	if (!result) {
		throw new Error('user.not.logged')
	}
	return result?.customer
}

export const getSimpleCustomerData = async () => {
	const result = await Wake.customer.getSimpleCustomer()
	return result?.customer || result
}

/**
 * Realiza requisição de criação de customer na Wake
 * @param {Object} user - O objeto do usuário / customer
 * @returns {Object} O objeto com os dados do usuário formatado.
 * @see {@link https://wakecommerce.readme.io/docs/storefront-api-customercreate}
 */
export const registerUser = async user => {
	const result = await Wake.customer.createCustomer(user)
	console.log('create >>', JSON.stringify(result))
	return result
}

export const getWishlist = async () => {
	return await Wake.customer.getWishList()
}

export const addToWishlist = async productId => {
	return await Wake.customer.addWishlistProduct(productId)
}

export const removeFromWishlist = async productId => {
	return await Wake.customer.removeWishlistProduct(productId)
}
/**
 * Formata os dados do usuário para criação Wake
 * @param {Object} user - O objeto do usuário a ser formatado.
 * @returns {Object} O objeto com os dados do usuário formatado.
 * @see {@link https://wakecommerce.readme.io/docs/storefront-api-customercreate}
 */
export const formatUserForCreate = (personType, user) => {
	if (personType === PERSON_TYPE.PERSON) {
		return formatPersonUserForCreate(user)
	}

	if (personType === PERSON_TYPE.COMPANY) {
		return formatCompanyUserForCreate(user)
	}

	return null
}

const formatPersonUserForCreate = user => {
	const formatedUser = {}
	formatedUser.customerType = PERSON_TYPE.PERSON

	formatedUser.email = validateString(user.email, true, 'email')
	formatedUser.cpf = validateCPF(user.cpf, true, 'cpf') ? user.cpf.replace(/\D/g, '') : null
	formatedUser.fullName = validateFullName(user.fullName, true, 'fullName')
	formatedUser.birthDate = validateDate(user.birthDate, true, 'birthDate')
	formatedUser.gender = validateGender(user.gender)

	const defaultFields = formatDefaultUserForCreate(user)

	return { ...formatedUser, ...defaultFields }
}

const formatCompanyUserForCreate = user => {
	const formatedUser = {}
	formatedUser.customerType = PERSON_TYPE.COMPANY

	formatedUser.email = validateString(user.email, true, 'email')
	formatedUser.cnpj = validateCNPJ(user.cnpj, true, 'cnpj') ? user.cnpj.replace(/\D/g, '') : null
	formatedUser.corporateName = validateString(user.corporateName, true, 'corporateName')

	const defaultFields = formatDefaultUserForCreate(user)

	return { ...formatedUser, ...defaultFields }
}

const formatDefaultUserForCreate = user => {
	const formatedUser = {}

	formatedUser.newsletter = user.newsletter === true

	formatedUser.password = validateString(user.password, true, 'password')
	formatedUser.passwordConfirmation = validateString(user.passwordConfirmation, true, 'passwordConfirmation')
	validatePasswordConfirmation(user.password, user.passwordConfirmation, true, 'passwordConfirmation')

	validatePhone(user.primaryPhoneNumber, true, 'primaryPhoneNumber')
	const phone = user.primaryPhoneNumber.replace(/\D/g, '')
	formatedUser.primaryPhoneAreaCode = phone.substring(0, 2)
	formatedUser.primaryPhoneNumber = `${phone.substring(2, 7)}-${phone.substring(7)}`

	if (user.secondaryPhoneNumber) {
		validateTotalDigits(user.secondaryPhoneNumber, 11, true, 'secondaryPhoneNumber')
		const phone2 = user.primaryPhoneNumber.replace(/\D/g, '')
		formatedUser.secondaryPhoneAreaCode = phone2.substring(0, 2)
		formatedUser.secondaryPhoneNumber = `${phone2.substring(2, 7)}-${phone2.substring(7)}`
	}

	formatedUser.receiverName = validateFullName(user.receiverName, true, 'receiverName')

	formatedUser.cep = validateTotalDigits(user.cep, 8, true, 'cep')
	formatedUser.address = validateString(user.address, true, 'address')
	formatedUser.addressNumber = validateString(user.addressNumber, true, 'addressNumber')
	formatedUser.neighborhood = validateString(user.neighborhood, true, 'neighborhood')
	formatedUser.city = validateString(user.city, true, 'city')
	formatedUser.state = validateString(user.state, true, 'state').toUpperCase()
	formatedUser.addressComplement = validateString(user.addressComplement)
	formatedUser.reference = validateString(user.reference)

	return formatedUser
}

export const getAddressByZipCode = async zipCode => {
	return await Wake.customer.getAddressByZipCode(zipCode)
}

export const updateCustomer = async user => {
	const result = await Wake.customer.customerUpdate(user)
	return result
}

export const sendRecoveryEmail = async email => {
	return await Wake.customer.customerPasswordRecovery(email)
}

export const listOrders = async () => {
	return await Wake.customer.getCustomerOrders()
}

export const getUserAddressesImpl = async customer => {
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

export const updateAddressImpl = async address => {
	const _address = {
		addressNumber: address.number,
		addressDetails: address.name,
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

export const removeAddressImpl = async address => {
	const addressId = address.id
	await Wake.customer.removeAddress(addressId)
}

export const addAddressImpl = async address => {
	const _address = {
		addressNumber: address.number,
		addressDetails: address.name,
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

export const notifyLoginToEitri = async (attempt = 0) => {
	if (attempt > 2) {
		return
	}

	try {
		const customer = await getCustomer()
		Eitri.exposedApis.session.notifyLogin({ customerId: customer.customerId })
	} catch (e) {
		console.error('Erro ao cadastrar notificação:', e)
		await delay(1000)
		return await notifyLoginToEitri(attempt + 1)
	}
}
