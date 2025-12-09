export const criticalWarning = (file, error, msg = '') => {
	// TODO - gerar alguma lógica para avisar por email? log externo?
	console.error(file, msg, error)
}
