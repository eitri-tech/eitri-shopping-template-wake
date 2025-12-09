import { Spacing, CustomButton } from 'shopping-wake-template-shared'

export default function ModalConfirm(props) {
	const { text, showModal, closeModal } = props

	return (
		<Modal
			show={showModal}
			position={'bottom'}
			onClose={() => closeModal(false)}>
			<View
				display='flex'
				direction='column'
				paddingHorizontal='large'
				paddingVertical='large'
				backgroundColor='accent-100'
				alignItems='center'
				borderRadius='none'
				borderColor='neutral-300'
				width='100%'>
				<View
					display='flex'
					direction='column'
					width='100%'
					alignItems='center'
					justfyContent='center'>
					<Spacing height={10} />
					<Text
						textAlign='center'
						fontSize='medium'
						fontWeight='bold'>
						{text}
					</Text>

					<View bottomInset />
				</View>
			</View>
		</Modal>
	)
}
