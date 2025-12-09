import { ERR_MSG, GENDER } from '../utils/Constants'
import moment from 'moment'

class ValidationError extends Error {
	constructor(message, field) {
		super(message)
		this.name = 'ValidationError_' + field
	}
}

/**
 * Valida o gênero enviado.
 * @param {string} value - O gênero, podendo ser MALE ou FEMALE.
 * @param {boolean} required - Indica se é obrigatório e atira erro em caso de valor inválido
 * @param {string} fieldError - Ao atirar um erro retorna o nome do campo no formato 'ValidationError_<fieldError>'
 * @returns {boolean} Retorna o gênero se for um valor válido ou null se não for
 */
export const validateGender = (value, required, fieldError) => {
	if ([GENDER.MALE, GENDER.FEMALE].includes(value)) {
		return value
	}
	if (required) throw new ValidationError(ERR_MSG.INVALID_VALUE, fieldError)

	return null
}

/**
 * Valida se valor passado é uma string.
 * @param {string} value - a string
 * @param {boolean} required - Indica se é obrigatório e atira erro em caso de vazio ou inválido
 * @param {string} fieldError - Ao atirar um erro retorna o nome do campo no formato 'ValidationError_<fieldError>'
 * @returns {boolean} Retorna a string sem espaço inicial e final ou Null em caso de erro
 */
export const validateString = (value, required, fieldError) => {
	const _value = value ? `${value}`.trim() : null
	if (_value) {
		return _value
	}
	if (required) throw new ValidationError(ERR_MSG.INVALID_VALUE, fieldError)

	return null
}

/**
 * Valida nome completo com sobrenome.
 * @param {string} value - a string com nome completo
 * @param {boolean} required - Indica se é obrigatório e atira erro em caso de vazio ou inválido
 * @param {string} fieldError - Ao atirar um erro retorna o nome do campo no formato 'ValidationError_<fieldError>'
 * @returns {boolean} Retorna nome completo ou Null em caso de erro
 */
export const validateFullName = (value, required, fieldError) => {
	const fullName = validateString(value, required, fieldError)
	if (fullName) {
		const parts = fullName.split(' ')
		if (parts.length > 1) {
			return fullName
		}
	}
	if (required) throw new ValidationError(ERR_MSG.INVALID_FULL_NAME, fieldError)

	return null
}

/**
 * Valida se valor passado é um numero
 * @param {number | string} value - o numero
 * @param {boolean} required - Indica se é obrigatório e atira erro em caso de vazio ou inválido
 * @param {string} fieldError - Ao atirar um erro retorna o nome do campo no formato 'ValidationError_<fieldError>'
 * @returns {boolean} Retorna o valor de entrada ou Null em caso inválido
 */
export const validateNumber = (value, required, fieldError) => {
	if (!isNaN(value) && !isNaN(parseFloat(value))) {
		return value
	}
	if (required) throw new ValidationError(ERR_MSG.INVALID_VALUE, fieldError)

	return null
}

/**
 * Valida se é uma data válida
 * @param {number | string} value - Data do componente Mask
 * @param {boolean} required - Indica se é obrigatório e atira erro em caso de vazio ou inválido
 * @param {string} fieldError - Ao atirar um erro retorna o nome do campo no formato 'ValidationError_<fieldError>'
 * @returns {boolean} Retorna a data formatada com DD/MM/YYYY ou Null em caso inválido
 */
export const validateDate = (value, required, fieldError) => {
	if (value) {
		value = value.replace(/\D/g, '')
		const isValid = isValidDate(value)
		if (isValid) {
			const day = value.substring(0, 2)
			const month = value.substring(2, 4)
			const year = value.substring(4)

			const newDate = `${day}/${month}/${year}`
			return newDate
		}
	}
	if (required) throw new ValidationError(ERR_MSG.INVALID_VALUE, fieldError)

	return null
}

/**
 * Valida se duas palavras são iguais
 * @param {string} pass - primeira palavra
 * @param {string} passConfirmation - segunda palavra
 * @param {boolean} required - Indica se é obrigatório e atira erro em caso de vazio ou inválido
 * @param {string} fieldError - Ao atirar um erro retorna o nome do campo no formato 'ValidationError_<fieldError>'
 * @returns {boolean} Retorna true ou false
 */
export const validatePasswordConfirmation = (pass, passConfirmation, required, fieldError) => {
	const comp = pass === passConfirmation
	if (comp) {
		return comp
	}
	if (required) throw new ValidationError(ERR_MSG.INVALID_PASS_CONFIRMATION, fieldError)

	return false
}

/**
 * Valida quantidade de dígitos numéricos
 * @param {string} digit - dígitos numéricos
 * @param {boolean} required - Indica se é obrigatório e atira erro em caso de vazio ou inválido
 * @param {string} fieldError - Ao atirar um erro retorna o nome do campo no formato 'ValidationError_<fieldError>'
 * @returns {string} Retorna string dos dígitos ou null em caso de erro
 */
export const validateTotalDigits = (digit, quantity, required, fieldError) => {
	if (digit) {
		const _digit = `${digit}`.replace(/\D/g, '')
		if (_digit.length === quantity) {
			return _digit
		}
	}
	if (required) throw new ValidationError(ERR_MSG.INVALID_VALUE, fieldError)

	return null
}

export const validatePhone = (digit, required, fieldError) => {
	if (digit) {
		const _digit = `${digit}`.replace(/\D/g, '')
		if (_digit.length === 10 || _digit.length === 11) {
			return _digit
		}
	}
	if (required) throw new ValidationError(ERR_MSG.INVALID_VALUE, fieldError)

	return null
}

/**
 * Valida se o CPF é valido
 * @param {number | string} value - o CPF
 * @param {boolean} required - Indica se é obrigatório e atira erro em caso de vazio ou inválido
 * @param {string} fieldError - Ao atirar um erro retorna o nome do campo no formato 'ValidationError_<fieldError>'
 * @returns {boolean} Retorna o CPF de entrada ou Null caso inválido
 */
export const validateCPF = (value, required, fieldError) => {
	if (value && isValidCPF(value)) {
		return value
	}
	if (required) throw new ValidationError(ERR_MSG.INVALID_CPF, fieldError)

	return null
}

/**
 * Valida se o CNPJ é valido
 * @param {number | string} value - o CNPJ
 * @param {boolean} required - Indica se é obrigatório e atira erro em caso de vazio ou inválido
 * @param {string} fieldError - Ao atirar um erro retorna o nome do campo no formato 'ValidationError_<fieldError>'
 * @returns {boolean} Retorna o CNPJ de entrada ou Null caso inválido
 */
export const validateCNPJ = (value, required, fieldError) => {
	if (value && isValidCNPJ(value)) {
		return value
	}
	if (required) throw new ValidationError(ERR_MSG.INVALID_CNPJ, fieldError)

	return null
}

/**
 * Valida um número de CPF.
 * @param {string} cpf - O número de CPF a ser validado.
 * @returns {boolean} Retorna true se o CPF for válido, caso contrário, false.
 */
export const isValidCPF = cpf => {
	cpf = cpf.replace(/[^\d]+/g, '')
	if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false

	let sum = 0
	let remainder

	for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
	remainder = (sum * 10) % 11
	if (remainder === 10 || remainder === 11) remainder = 0
	if (remainder !== parseInt(cpf.substring(9, 10))) return false

	sum = 0
	for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
	remainder = (sum * 10) % 11
	if (remainder === 10 || remainder === 11) remainder = 0
	if (remainder !== parseInt(cpf.substring(10, 11))) return false

	return true
}

/**
 * Valida um número de CNPJ.
 * @param {string} cnpj - O número de CNPJ a ser validado.
 * @returns {boolean} Retorna true se o CNPJ for válido, caso contrário, false.
 */
export const isValidCNPJ = cnpj => {
	cnpj = cnpj.replace(/[^\d]+/g, '')
	if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false

	let length = cnpj.length - 2
	let numbers = cnpj.substring(0, length)
	let digits = cnpj.substring(length)
	let sum = 0
	let pos = length - 7

	for (let i = length; i >= 1; i--) {
		sum += numbers.charAt(length - i) * pos--
		if (pos < 2) pos = 9
	}
	let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
	if (result !== parseInt(digits.charAt(0))) return false

	length = length + 1
	numbers = cnpj.substring(0, length)
	sum = 0
	pos = length - 7

	for (let i = length; i >= 1; i--) {
		sum += numbers.charAt(length - i) * pos--
		if (pos < 2) pos = 9
	}
	result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
	if (result !== parseInt(digits.charAt(1))) return false

	return true
}

/**
 * Valida uma data no formato 'dd/mm/aaaa'.
 * @param {string} date - A data a ser validada no formato DDMMYYYY
 * @returns {boolean} Retorna true se a data for válida, caso contrário, false.
 */
function isValidDate(date) {
	// Verifica o formato da data usando regex
	const regex = /^(\d{2})(\d{2})(\d{4})$/
	if (!regex.test(date)) {
		return false
	}

	// Extrai dia, mês e ano da data
	const [_, day, month, year] = date.match(regex)

	// Converte para inteiros
	const dayInt = parseInt(day, 10)
	const monthInt = parseInt(month, 10)
	const yearInt = parseInt(year, 10)

	// Verifica se os valores de dia, mês e ano são válidos
	if (monthInt < 1 || monthInt > 12) {
		return false
	}

	const daysInMonth = [
		31,
		(yearInt % 4 === 0 && yearInt % 100 !== 0) || yearInt % 400 === 0 ? 29 : 28,
		31,
		30,
		31,
		30,
		31,
		31,
		30,
		31,
		30,
		31
	]
	if (dayInt < 1 || dayInt > daysInMonth[monthInt - 1]) {
		return false
	}

	return true
}
