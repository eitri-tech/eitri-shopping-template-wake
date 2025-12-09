import closeIcon from '../../assets/icons/close.svg'
import { registerStockAlert } from '../../services/ProductService'
import { CustomButton, BottomInset, CustomInput } from 'shopping-wake-template-shared'

export default function ModalConfirmStockAlert(props) {
	const { closeModal, product } = props

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')

	const doRegisterStockAlert = async () => {
		try {
			if (!name || !email) return
			const productVariantId = product?.attributeSelections?.selectedVariant?.productVariantId
			if (!productVariantId) return
			await registerStockAlert(name, email, productVariantId)
			closeModal()
		} catch (e) {
			console.error('Erro on register stock', e)
			closeModal()
		}
	}

	return (
		<View
			className='z-[9999] !bg-black/70 !opacity-100 fixed inset-0 flex items-end justify-center'
			onClick={closeModal}>
			<View
				className='bg-base-100 p-4 w-screen'
				onClick={e => e.stopPropagation()}>
				<View
					className='flex justify-end items-center'
					onClick={closeModal}>
					<Image
						src={closeIcon}
						alt='Ícone de fechar'
						width={12}
					/>
				</View>

				<View className='mt-4'>
					<Text className='text-xs block'>É só selecionar o tamanho e preencher o email</Text>
					<Text className='text-xs block'>Assim que a peça chegar, te avisamos!</Text>
				</View>

				<View className='flex flex-col gap-2 mt-4'>
					<CustomInput
						placeholder='nome'
						value={name}
						onChange={e => setName(e.target.value)}
					/>

					<CustomInput
						placeholder='email'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</View>

				<CustomButton
					outlined
					label='Enviar'
					className='mt-10'
					onClick={doRegisterStockAlert}
				/>

				<BottomInset />
			</View>
		</View>
	)
}
