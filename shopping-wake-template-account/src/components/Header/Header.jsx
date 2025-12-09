import Eitri from 'eitri-bifrost'
import closeIcon from '../../assets/icons/close.svg'
import { HeaderContentWrapper } from 'shopping-wake-template-shared'

export default function Header(props) {
	const { showBackButton } = props

	const goToBack = () => Eitri.bottomBar.changeTab({ index: 0 })

	return (
		<HeaderContentWrapper
			className='bg-gray-100 justify-between h-10 py-3'
			scrollEffect={false}>
			{showBackButton && (
				<View onClick={goToBack}>
					<Image
						src={closeIcon}
						width={16}
					/>
				</View>
			)}

			<Text
				fontSize='large'
				fontWeight='medium'>
				Minha conta
			</Text>

			<View />
		</HeaderContentWrapper>
	)
}
