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

	return (
		<View
			className={`relative w-full flex flex-col shadow-lg border ${isSelected ? 'border-black' : 'border-gray'} px-4 py-2 gap-2`}
			{...rest}>
			<Text className='text-sm font-bold'>{title}</Text>
			<Text className='text-xs text-neutral-500'>{fullAddress}</Text>

			{showRemoveConfirmation ? (
				<View className='flex items-center gap-2 mt-1 '>
					<Text>Confirma a remoção do endereço?</Text>
					<View
						onClick={onRemove}
						className='bg-neutral-100 py-0.5 px-2'>
						Sim
					</View>
					<View
						onClick={() => setShowRemoveConfirmation(false)}
						className='bg-neutral-100 py-0.5 px-2'>
						Não
					</View>
				</View>
			) : (
				<View className='flex gap-2 mt-1'>
					<View
						onClick={onEdit}
						className='bg-neutral-100 py-0.5 px-2'>
						Editar
					</View>
					{isRemovable && (
						<View
							onClick={handleRemoveAddress}
							className='bg-neutral-100 py-0.5 px-2'>
							Remover
						</View>
					)}
				</View>
			)}
		</View>
	)
}
