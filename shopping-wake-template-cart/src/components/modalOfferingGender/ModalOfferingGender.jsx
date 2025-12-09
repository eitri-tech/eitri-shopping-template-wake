export default function ModalOfferingGender(props) {
	const { show, onConfirm, onCancel } = props

	const [gender, setGender] = useState('Menino')
	const [modalOpen, setModalOpen] = useState(false)

	useEffect(() => {
		setModalOpen(show)
	}, [show])

	const _onConfirm = () => {
		onConfirm(gender)
	}

	const _onCancel = () => {
		onCancel()
	}

	return (
		<Modal
			show={modalOpen}
			onClose={_onCancel}>
			<View
				backgroundColor='background-color'
				padding='large'
				borderRadius='small'>
				<View>
					<Text
						block
						fontWeight='bold'
						fontSize='medium'>
						Para quem vai ser o presente?
					</Text>
					<Text
						block
						fontSize='small'>
						Selecione o gênero
					</Text>
				</View>
				<View
					borderColor='neutral-500'
					paddingVertical='small'
					marginTop='small'
					borderTopWidth='hairline'>
					<View
						onPress={() => setGender('Menino')}
						borderWidth='thin'
						borderRadius='small'
						padding='nano'
						borderColor={gender === 'Menino' ? 'primary-700' : 'neutral-300'}>
						<Text
							fontSize='small'
							fontWeight='bold'>
							Menino
						</Text>
					</View>
					<View
						onPress={() => setGender('Menina')}
						borderWidth='thin'
						borderRadius='small'
						padding='nano'
						marginTop='small'
						borderColor={gender === 'Menina' ? 'primary-700' : 'neutral-300'}>
						<Text
							fontSize='small'
							fontWeight='bold'>
							Menina
						</Text>
					</View>
				</View>
				<View marginTop='small'>
					<View
						onPress={_onConfirm}
						marginTop='small'
						padding='medium'
						display='flex'
						justifyContent='center'
						backgroundColor='primary-700'
						borderRadius='pill'>
						<Text
							color='background-color'
							fontWeight='bold'>
							Confirmar
						</Text>
					</View>
					<View
						onPress={_onCancel}
						marginTop='small'
						padding='medium'
						display='flex'
						justifyContent='center'
						backgroundColor='neutral-100'
						borderRadius='pill'>
						<Text
							color='primary-700'
							fontWeight='bold'>
							Cancelar
						</Text>
					</View>
				</View>
			</View>
		</Modal>
	)
}
