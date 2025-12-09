import { CustomButton, Spacing } from 'shopping-wake-template-shared'

export default function ModalMessage(props) {
	const { children, title, text, showModal, closeModal } = props

	if (!showModal) return null

	return (
		<View className=' fixed inset-0 flex items-center justify-center bg-black/50 z-[1000]'>
			<View className=' flex flex-col items-center bg-white p-6 border border-neutral-300 rounded-none shadow-2xl w-4/5 '>
				<View className='flex flex-col items-center justify-center w-full'>
					<View className='h-2.5' />

					{title && (
						<View className='mb-6'>
							<Text className='text-center text-base font-bold'>{title}</Text>
						</View>
					)}

					<Text className='text-center text-base'>{text}</Text>

					<View className='w-full flex justify-center'>
						<CustomButton
							className=' mt-6 border bg-primary text-primary-content rounded-none border-[0.5px] w-full '
							label='Fechar'
							onClick={closeModal}
						/>
					</View>

					<View className='flex w-full'>{children}</View>
				</View>
			</View>
		</View>
	)
}
