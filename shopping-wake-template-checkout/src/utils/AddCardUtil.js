export const errorFormatValue = (type, value) => {
	let result = false
	switch (type) {
		case 'number':
			result = verifyNumberError(value)
			break
		case 'holderName':
			result = verifyHolderNameError(value)
			break
		case 'expirationDate':
			result = verifyExpirationDateError(value)
			break
		case 'document':
			result = verifyCpfError(value)
			break
		case 'securityCode':
			result = verifySecurityCodeError(value)
			break
	}
	return result
}

const verifyNumberError = value => {
	if (value?.length < 16) {
		return true
	}
	return false
}

const verifyHolderNameError = value => {
	if (value?.length < 3) {
		return true
	}
	return false
}

const verifyExpirationDateError = value => {
	if (!value || !/^\d{2}\/\d{4}$/.test(value)) return true

	const [month, year] = value.split('/').map(Number)
	const currentDate = new Date()
	const currentYear = currentDate.getFullYear()
	const currentMonth = currentDate.getMonth() + 1

	if (month < 1 || month > 12) return true

	if (year < currentYear) return true

	if (year === currentYear && month < currentMonth) return true

	return false
}

const verifyCpfError = value => {
	const cpfRegex = value?.replace(/\D/g, '')
	if (cpfRegex?.length !== 11 || /^(\d)\1{10}$/.test(cpfRegex)) {
		return true
	}
	return false
}

const verifySecurityCodeError = value => {
	if (!/^\d{3,4}$/.test(value) || /^(\d)\1{2,3}$/.test(value)) {
		return true
	}
	return false
}
