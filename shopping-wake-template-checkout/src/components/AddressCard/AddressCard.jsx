export default function AddressCard(props) {
	const { title, fullAddress, isSelectable, onSelect, isSelected, isRemovable, onRemove, onEdit, ...rest } = props

	const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false)

	const setAddress = () => {
		if (isSelectable) {
			onSelect()
		}
	}

	const handleRemoveAddress = () => {
		setShowRemoveConfirmation(true)
	}

	const Radio = ({ checked }) => (
		<View
			className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
				checked ? 'border-primary-500' : 'border-gray-300'
			}`}>
			{checked && <View className='h-3 w-3 rounded-full bg-primary' />}
		</View>
	)

	return (
		<View
			className={`border p-4 transition-all border-gray-200`}
			{...rest}>
			<View
				className='flex cursor-pointer items-start justify-between gap-4'
				onClick={setAddress}>
				<View className='flex-grow'>
					<Text className='text-sm font-medium block'>{title}</Text>
					<Text className='mt-1 text-sm text-gray-600'>{fullAddress}</Text>
				</View>

				{isSelectable && (
					<View className='w-auto'>
						<Radio checked={isSelected} />
					</View>
				)}
			</View>

			{showRemoveConfirmation && (
				<View className='mt-4 border-t border-gray-200 pt-4'>
					<Text className='mb-3 text-sm text-gray-700'>Confirma a remoção do endereço?</Text>

					<View className='flex items-center gap-4'>
						<View
							onClick={onRemove}
							className='cursor-pointer bg-meteorite-01 px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-red-600'>
							<Text>Sim</Text>
						</View>

						<View
							onClick={() => setShowRemoveConfirmation(false)}
							className='cursor-pointer bg-gray-200 px-4 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300'>
							<Text>Não</Text>
						</View>
					</View>
				</View>
			)}

			{!showRemoveConfirmation && (isRemovable || onEdit) && (
				<View className='mt-4 flex items-center gap-6 border-t border-gray-200 pt-3'>
					{onEdit && (
						<View
							onClick={onEdit}
							className='cursor-pointer'>
							<Text className='text-xs font-medium text-primary-600 underline'>Editar</Text>
						</View>
					)}

					{isRemovable && (
						<View
							onClick={handleRemoveAddress}
							className='cursor-pointer'>
							<Text className='text-xs font-medium text-primary-600 underline'>Remover</Text>
						</View>
					)}
				</View>
			)}
		</View>
	)
}
