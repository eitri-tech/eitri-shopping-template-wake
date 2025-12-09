import { Loading } from 'shopping-wake-template-shared'

export default function SaveButton(props) {
	const { handleSaveFavorite, isInWishlist, loading } = props

	return (
		<View onPress={handleSaveFavorite}>
			<View
				display='flex'
				justifyContent='center'
				alignItems='center'
				padding='small'
				direction='row'
				width={'30'}
				height={'30'}>
				{loading ? (
					<Loading
						width='25px'
						height='25px'
					/>
				) : (
					<Image
						iconKey='heart'
						color={isInWishlist ? 'negative-700' : 'neutral-700'}
						width={25}
						height={25}
					/>
				)}
			</View>
		</View>
	)
}
