import bag from '../../../assets/images/bag.svg'

export default function HeaderCart(props) {
	const { quantityOfItems, backgroundColor, textColor, iconColor, navigateToCart } = props
	return (
		<View
			position='relative'
			marginRight={quantityOfItems > 0 ? 'nano' : 'none'}
			display='flex'
			alignItems='center'
			justifyContent='center'
			height={24}
			onClick={navigateToCart}>
			<Image
				width={24}
				height={24}
				color={iconColor || 'primary-700'}
				src={bag}
			/>

			{quantityOfItems > 0 && (
				<View
					position='absolute'
					top={-8}
					right={-10}
					display='flex'
					backgroundColor={iconColor || 'primary-700'}
					borderRadius='circular'
					width={20}
					height={20}
					justifyContent='center'
					alignItems='center'>
					<Text
						color={textColor || 'accent-100'}
						fontWeight='bold'
						fontSize='quark'>
						{quantityOfItems}
					</Text>
				</View>
			)}
		</View>
	)
}
