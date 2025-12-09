import Eitri from 'eitri-bifrost'
import ArrowLeftImage from '../assets/images/arrow_left.png'

export default function HeaderComponent() {
	const onBackClick = () => {
		Eitri.close()
	}

	return (
		<View backgroundColor='neutral-900'>
			<View topInset />
			<View
				direction='row'
				justifyContent='start'
				alignItems='center'
				padding='nano'
				minHeight={60}
				backgroundColor='neutral-900'>
				<View
					width={50}
					onClick={onBackClick}>
					<Image
						src={ArrowLeftImage}
						cover
						width={40}
					/>
				</View>
				<Text
					wide
					textAlign='left'
					color='neutral-100'
					fontWeight='bold'
					fontSize='small'>
					Meet Eitri!
				</Text>
			</View>
		</View>
	)
}
