export default function Quantity(props) {
	const { productVariantId, quantity, disable, handleRemoveCartItem, handleAddCartItem } = props

	return (
		<View
			display='flex'
			direction='row'
			justifyContent='center'
			alignItems='center'
			gap={4}
			padding='quark'>
			<View
				width='22px'
				height='22px'
				display='flex'
				alignItems='center'
				justifyContent='center'>
				<View onPress={() => handleRemoveCartItem(productVariantId, 1)}>
					<Image
						iconKey='minus'
						width={20}
						height={20}
						color={'primary-500'}
					/>
				</View>
			</View>

			<View
				display='flex'
				alignItems='center'
				justifyContent='center'
				marginHorizontal='nano'>
				<Text fontSize='extra-small'>{quantity}</Text>
			</View>

			<View
				width='22px'
				height='22px'
				display='flex'
				alignItems='center'
				justifyContent='center'>
				{disable ? (
					<Image
						iconKey='plus'
						width={20}
						height={20}
						color={'neutral-300'}
					/>
				) : (
					<View onPress={() => handleAddCartItem(productVariantId, 1)}>
						<Image
							iconKey='plus'
							width={20}
							height={20}
							color={'primary-500'}
						/>
					</View>
				)}
			</View>
		</View>
	)
}
