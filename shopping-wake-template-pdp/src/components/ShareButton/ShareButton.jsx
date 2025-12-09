import Eitri from 'eitri-bifrost'

export default function ShareButton(props) {
	const { productUrl } = props

	const shareProduct = async () => {
		await Eitri.share.link({
			url: `${productUrl}?utm_source=app&utm_medium=product&utm_campaign=share`
		})
	}

	return (
		<View
			borderRadius='circular'
			padding='nano'
			display='flex'
			alignItems='center'
			justfyContent='center'
			onClick={shareProduct}>
			{/*<Icon iconKey='share-2' height={25} width={25} />*/}
		</View>
	)
}
