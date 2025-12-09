export default function ModalErrorPayment(props) {
	const { showModal, closeModal } = props

	if (!showModal) {
		return null
	}

	return (
		<Modal
			show={showModal}
			position={'center'}
			onClose={closeModal}>
			{/* Backdrop */}
			<View
				onClick={closeModal}
				className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'>
				{/* Modal Panel */}
				<View
					onClick={e => e.stopPropagation()}
					className='mx-4 flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-xl bg-white p-8 text-center shadow-2xl'>
					{/* Icon */}
					<View className='flex h-14 w-14 items-center justify-center rounded-full bg-red-100'>
						<Image
							iconKey='alert-triangle'
							className='h-8 w-8 text-red-600'
						/>
					</View>

					{/* Text Content */}
					<View className='flex flex-col gap-2'>
						<Text className='text-xl font-bold text-gray-800'>
							Não foi possível concluir o seu pagamento.
						</Text>
						<Text className='text-base text-gray-600'>
							Por favor, revise seus dados de pagamento e tente novamente.
						</Text>
						<Text className='mt-2 text-sm text-gray-500'>
							Se o problema persistir, verifique com a operadora do seu cartão ou tente outro método de
							pagamento.
						</Text>
					</View>

					{/* Close Button */}
					<View className='mt-4 w-full'>
						<Button
							color='primary'
							onClick={closeModal}
							label='Fechar'
							block
						/>
					</View>
				</View>
			</View>
		</Modal>
	)
}
