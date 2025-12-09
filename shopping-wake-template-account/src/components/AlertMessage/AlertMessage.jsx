export default function AlertMessage(props) {
	const { message, type, duration, onDismiss, className } = props

	useEffect(() => {
		const timer = setTimeout(() => {
			if (typeof onDismiss === 'function') {
				onDismiss('')
			}
		}, duration * 1000)

		return () => clearTimeout(timer)
	}, [])

	const alertTypeClass =
		{
			negative: 'text-red-500',
			success: 'text-green-500',
			warning: 'text-orange-500',
			info: 'text-blue-500'
		}[type || 'negative'] || 'text-red-500'

	return <Text className={`${className} ${alertTypeClass} text-sm`}>{message}</Text>
}
