import { CustomButton } from 'shopping-wake-template-shared'

export default function GenericModal(props) {
	const { showModal, closeModal, buttonLabel, onClick, secondaryButtonLabel, secondaryOnPress, title, description } =
		props

	if (!showModal) {
		return null
	}

	return (
		// Backdrop
		<View
			onClick={closeModal}
			className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'>
			{/* Modal Panel */}
			<View
				// Prevent click from closing modal
				onClick={e => e.stopPropagation()}
				className='mx-4 flex w-full max-w-md flex-col items-center justify-center gap-5 rounded-xl bg-white p-8 shadow-2xl'>
				{title && <Text className='text-center text-xl font-bold text-gray-800'>{title}</Text>}
				{description && <Text className='text-center text-base text-gray-600'>{description}</Text>}

				{/* Buttons Container */}
				<View className='mt-4 flex w-full flex-col gap-3'>
					{onClick && (
						<CustomButton
							label={buttonLabel || 'Entendi'}
							onClick={onClick}
							block
						/>
					)}

					{secondaryOnPress && (
						<CustomButton
							backgroundColor='transparent'
							color='primary-700'
							borderColor='primary-700'
							borderWidth='hairline'
							label={secondaryButtonLabel || 'Voltar'}
							onClick={secondaryOnPress}
							block
						/>
					)}
				</View>
			</View>
		</View>
	)
}
