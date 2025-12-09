export default function HeaderSearchIcon(props) {
	const { navigateToSearch, contentColor } = props

	return (
		<View
			onClick={navigateToSearch}
			width={40}
			height={40}
			alignItems='center'
			justifyContent='center'
			marginRight='micro'>
			{/* <Icon
				width={24}
				height={24}
				iconKey='search'
				color={contentColor || 'accent-100'}
			/> */}
		</View>
	)
}
