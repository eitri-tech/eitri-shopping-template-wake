export const delay = async ms => {
	return new Promise((resolve, _reject) => setTimeout(resolve, ms))
}

export const formatCurrency = value => {
	const valueBRL = parseFloat(value).toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	})

	return valueBRL
}

export const parseToISODate = (dateStr, isCompactedDate) => {
	if (isCompactedDate) {
		const day = dateStr.slice(0, 2)
		const month = dateStr.slice(2, 4)
		const year = dateStr.slice(4)
		return new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString()
	}
	const [day, month, year] = dateStr.split('/').map(Number)

	return new Date(year, month - 1, day).toISOString()
}

export const formatDate = date => {
	return new Date(date).toLocaleDateString('pt-br')
}

export const formatDateDaysMonthYear = date => {
	const data = new Date(date)
	const dia = data.getDate()
	const mes = data.toLocaleString('pt-BR', { month: 'long' })
	const ano = data.getFullYear()

	return `${dia} de ${mes} de ${ano}`
}

export const normalizeString = str =>
	str
		?.toLowerCase()
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9\s]/g, '')

export const formatCPF = cpf => {
	let digits = cpf.replace(/\D/g, '')
	digits = digits.padStart(11, '0')
	return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const formatPhone = phone => {
	const digits = phone.replace(/\D/g, '')

	if (digits.length === 0) return ''

	if (digits.length <= 2) return `(${digits}`
	if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
	if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`

	return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

export const formatImageUrl = (urlString, width, height) => {
	if (!urlString) return ''
	try {
		const url = new URL(urlString);

		// remove w e h sempre
		url.searchParams.delete('w');
		url.searchParams.delete('h');

		// Se width/height forem fornecidos, recoloca
		if (width) url.searchParams.set('w', width);
		if (height) url.searchParams.set('h', height);

		return url.toString();
	} catch {
		return urlString
	}
}
