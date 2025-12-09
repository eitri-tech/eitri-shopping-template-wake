import Loading from '../Loading/LoadingComponent'

export default function CustomButton(props) {
	const {
		disabled,
		color,
		backgroundColor,
		variant,
		label,
		onPress,
		onClick,
		isLoading,
		width,
		borderRadius,
		className,
		outlined,
		children,
		leftIcon,
		textClassName,
		...rest
	} = props

	const _onPress = () => {
		if (!disabled && onPress && typeof onPress === 'function') {
			onPress()
		}

		if (!disabled && onClick && typeof onClick === 'function') {
			onClick()
		}
	}

	const _backgroundColor = (() => {
		if (variant === 'outlined' || outlined) {
			return 'transparent'
		}
		return isLoading || disabled ? 'bg-gray-300' : 'bg-primary'
	})()

	const _contentColor = (() => {
		if (variant === 'outlined' || outlined) {
			return 'text-primary'
		}
		return isLoading || disabled ? 'bg-gray-300' : 'text-primary-content'
	})()

	const renderContent = () => {
		if (leftIcon) {
			return (
				<View className='flex items-center gap-2'>
					<View className={_contentColor}>{leftIcon}</View>
					<Text className={` ${_contentColor}`}>{label}</Text>
				</View>
			)
		}

		return <Text className={`text-sm ${_contentColor} ${textClassName || ''}`}>{label}</Text>
	}

	return (
		<View
			onClick={_onPress}
			className={`
				flex items-center justify-center 
				h-9
				w-full
				${_backgroundColor ? `${_backgroundColor}` : ''}
				${variant === 'outlined' || outlined ? `border border-primary` : ''}
				${className || ''}
			`}
			{...rest}>
			{children || (isLoading ? <Loading /> : renderContent())}
		</View>
	)
}
