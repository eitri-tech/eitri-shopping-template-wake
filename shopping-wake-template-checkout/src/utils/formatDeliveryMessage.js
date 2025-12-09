export const formatDeliveryMessage = (deadline, deadlineInHours, isPickup) => {
	if (isPickup) {
		if (deadline === 0) return 'Retire hoje'
		return `Retire a partir de ${deadline} ${deadline === 1 ? 'dia útil' : 'dias úteis'}`
	}

	if (deadlineInHours) {
		return `Entrega em até ${deadlineInHours} ${deadlineInHours === 1 ? 'hora' : 'horas'}`
	}

	if (deadline === 0) return 'Entrega hoje'

	return `Entrega em até ${deadline} ${deadline === 1 ? 'dia útil' : 'dias úteis'}`
}
