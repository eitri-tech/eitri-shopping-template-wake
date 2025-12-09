export default function HeaderWishList(props) {
	const { navigateToWishList, contentColor } = props

	return (
		<View
			onClick={navigateToWishList}
			width={40}
			height={40}
			alignItems='center'
			justifyContent='end'
			marginLeft='micro'>
			{/* <Icon
				width={24}
				height={24}
				iconKey='heart'
				color={contentColor || 'accent-100'}
			/> */}
		</View>
	)
}
