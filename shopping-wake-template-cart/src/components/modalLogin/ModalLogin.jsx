import Eitri from 'eitri-bifrost'
import { Spacing, CustomButton } from 'shopping-wake-template-shared'

export default function ModalLogin(props) {
	const { showModal, closeModal } = props

	const goToAccount = () => {
		Eitri.nativeNavigation.open({
			slug: 'account'
		})
		closeModal()
	}

	return (
		<Modal
			show={showModal}
			position={'center'}
			onClose={closeModal}>
			<View
				direction='column'
				paddingHorizontal='large'
				paddingVertical='display'
				backgroundColor='accent-100'
				alignItems='center'
				justfyContent='center'
				gap={20}
				borderRadius='circular'
				borderColor='neutral-300'
				width='80%'>
				<Text
					textAlign='center'
					fontSize='medium'
					fontWeight='bold'>
					Para utilizar o cupom, é necessário acessar sua conta. Gostaria de fazer isso agora?
				</Text>
				<CustomButton
					marginTop='large'
					width='80%'
					label={'Acessar conta'}
					onPress={goToAccount}
					block
				/>
				<CustomButton
					marginTop='large'
					width='80%'
					label={'Cancelar'}
					onPress={closeModal}
					borderColor='primary-700'
					borderWidth='hairline'
					backgroundColor='accent-100'
					color='primary-700'
					block
				/>
			</View>
		</Modal>
	)
}
