// TO-DO passar formatCurrency e outros utils para shared
export const formatCurrency = value => {
	const valueBRL = parseFloat(value).toLocaleString('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	})

	return valueBRL
}

export const delay = async ms => {
	return new Promise((resolve, _reject) => setTimeout(resolve, ms))
}

export const parseBrazilPhone = input => {
	if (typeof input !== 'string') return null

	// tenta casar formatos comuns: +55 (21) 99122-6186  ou  (21)991226186  ou 21991226186 etc.
	const rx = /^\s*(?:\+?55[\s-]*)?(?:\(?(\d{2})\)?)[\s-]*?(\d{4,5})[\s-]?(\d{4})\s*$/
	const m = input.match(rx)
	if (!m) {
		// fallback genérico: remover não dígitos e inferir DDD (2 dígitos)
		const digits = input.replace(/\D+/g, '')
		// possível formatos: DDD+8 ou DDD+9 (10 ou 11 dígitos), ou com código país 55+DDD+...
		let d = digits
		if (d.startsWith('55')) d = d.slice(2)
		if (d.length === 10 || d.length === 11) {
			const area = d.slice(0, 2)
			const numberDigits = d.slice(2)
			return {
				area,
				number: numberDigits,
				numberFormatted:
					numberDigits.length === 9
						? numberDigits.slice(0, 5) + '-' + numberDigits.slice(5)
						: numberDigits.slice(0, 4) + '-' + numberDigits.slice(4)
			}
		}
		return null // não conseguiu parsear
	}

	const area = m[1]
	const numberDigits = m[2] + m[3]
	const numberFormatted =
		numberDigits.length === 9
			? numberDigits.slice(0, 5) + '-' + numberDigits.slice(5)
			: numberDigits.slice(0, 4) + '-' + numberDigits.slice(4)

	return { area, number: numberDigits, numberFormatted }
}

export const parseToISODate = dateString => {
	if (!dateString) return null

	const [day, month, year] = dateString.split('/')
	return new Date(`${year}-${month}-${day}`)
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