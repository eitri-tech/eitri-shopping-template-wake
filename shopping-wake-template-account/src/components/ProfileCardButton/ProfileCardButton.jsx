import arrowAccount from '../../assets/icons/arrow_account.svg'

export default function ProfileCardButton(props) {
	const { children, icon, label, onClick, className, labelClassName } = props

	const handlerClick = () => {
		if (onClick) {
			onClick()
		}
	}

	return (
		<View
			className={`flex flex-row justify-start items-certer w-full border border-black rounded-none ${className}`}
			onClick={handlerClick}>
			<View className='flex p-2 items-center justify-center bg-gray-200'>
				{icon && (
					<Image
						src={icon}
						height={16}
						width={16}
					/>
				)}
			</View>

			<Text className={`text-sm p-2 ${labelClassName}`}>
				{label}
				{children}
			</Text>
		</View>
	)
}
