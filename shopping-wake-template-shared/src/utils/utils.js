export const formatAmountInCents = amount => {
	if (typeof amount !== 'number') {
		return ''
	}
	if (amount === 0) {
		return 'Grátis'
	}
	return (amount / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
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

export const addDaysToDate = (daysToAdd, onlyBusinessDays = true) => {
	let currentDate = new Date()

	currentDate.setHours(12)
	currentDate.setMinutes(0)
	currentDate.setSeconds(0)
	currentDate.setMilliseconds(0)

	let count = 0
	while (count < daysToAdd) {
		currentDate.setDate(currentDate.getDate() + 1)
		// Check if it's not a weekend (Saturday: 6, Sunday: 0)
		if (!onlyBusinessDays || (currentDate.getDay() !== 0 && currentDate.getDay() !== 6)) {
			count++
		}
	}
	return currentDate
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