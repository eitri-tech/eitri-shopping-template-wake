import Eitri from 'eitri-bifrost'
import {
	HeaderContentWrapper,
	HeaderReturn,
	CustomInput,
	CustomButton,
	BottomInset,
	HeaderText
} from 'shopping-wake-template-shared'
import BottomFixed from '../components/BottomFixed/BottomFixed'
import { useCheckout } from '../providers/UseCheckout'
import { getAddressByZipCode } from '../services/CustomerServices'
import { UF } from '../utils/Constants'
import { logScreenView, sendLogError } from '../services/TrackingService'

export default function AddressForm(props) {
	const PAGE = 'Checkout - Editar endereço'

	const { updateAddress, addAddress, customer, checkout } = useCheckout()
	const [userAddress, setUserAddress] = useState({})
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const comeFromSimpleLogin = props?.location?.state?.comeFromSimpleLogin

	useEffect(() => {
		startForm()
		logScreenView(PAGE, 'AddressForm')
	}, [])

	const startForm = async () => {
		const currentAddress = props?.location?.state
		if (currentAddress) {
			setUserAddress({
				id: currentAddress.id,
				name: currentAddress.title,
				cep: currentAddress.cep,
				street: currentAddress.address,
				number: currentAddress.addressNumber,
				complement: currentAddress.addressDetails,
				city: currentAddress.city,
				state: currentAddress.state,
				neighborhood: currentAddress.neighborhood,
				receiverName: currentAddress.receiverName,
				referencePoint: currentAddress.referencePoint || ''
			})
		} else {
			setUserAddress({
				receiverName: customer?.customerName || props?.location?.state?.customerName
			})
		}
	}

	const setField = (field, value) => {
		setUserAddress({ ...userAddress, [field]: value, [`${field}ErrorMsg`]: '' })
	}

	const onZipCodeChange = async zipCode => {
		const zipCodeNumeric = zipCode.replace(/\D/g, '')

		setUserAddress(prev => ({
			...prev,
			cep: zipCode,
			cepErrorMsg: ''
		}))

		if (zipCodeNumeric.length === 8) {
			try {
				const address = await getAddressByZipCode(zipCodeNumeric)
				setUserAddress({
					...userAddress,
					street: `${address?.street}`,
					neighborhood: address?.neighborhood,
					city: address?.city,
					state: address?.state,
					cep: zipCode
				})
			} catch (error) {
				console.log('CEP error:', error)
				setUserAddress(prev => ({
					...prev,
					cepErrorMsg: 'CEP não encontrado'
				}))
			}
		}
	}

	const onChangeAddress = (key, value) => {
		setUserAddress({
			...userAddress,
			[key]: value
		})
	}

	const onSaveAddress = async () => {
		try {
			setLoading(true)

			const requiredFields = ['cep', 'city', 'receiverName', 'state']
			let hasErrors = false

			requiredFields.forEach(field => {
				if (!userAddress[field]) {
					setField(`${field}ErrorMsg`, `O campo ${field} é obrigatório`)
					hasErrors = true
				}
			})

			if (hasErrors) {
				const firstErrorField = requiredFields.find(field => !userAddress[field])
				const element = document.getElementById(`frm_${firstErrorField}`)
				if (element) {
					element.focus()
				}
				throw new Error('Campos obrigatórios não preenchidos.')
			}

			if (userAddress.id) {
				console.log('Atualizando endereço...')
				await updateAddress(userAddress)
			} else {
				console.log('Criando novo endereço...')
				await addAddress(userAddress)
			}

			if (comeFromSimpleLogin) {
				Eitri.navigation.navigate({
					path: 'Home',
					replace: true
				})
				return
			}

			Eitri.navigation.back()
		} catch (error) {
			sendLogError(error, '[AddressForm]onSaveAddress', {
				userEmail: customer?.email,
				cartId: checkout?.checkoutId,
				payload: userAddress
			})
			setError('Não foi possível concluir seu cadastro. Por favor, revise as informações e tente novamente.')
			setTimeout(() => {
				setError('')
			}, 8000)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper
				className='flex items-center justify-between bg-accent-300 py-2'
				scrollEffect={false}>
				<HeaderReturn />

				<HeaderText
					className='w-fit'
					text='Gerencie o seu endereço de entrega'
				/>

				<View className='w-5' />
			</HeaderContentWrapper>

			<View className='p-4'>
				<View className='flex flex-col gap-4 mt-6'>
					<CustomInput
						id='frm_cep'
						label='cep *'
						mask='99999-999'
						placeholder='Digite o CEP'
						value={userAddress.cep || ''}
						onChange={e => onZipCodeChange(e.target.value)}
						type='number'
						inputMode='numeric'
						backgroundColorError={userAddress.cepErrorMsg ? 'negative-300' : ''}
					/>

					{userAddress.cepErrorMsg && <Text className='text-red-700'>{userAddress.cepErrorMsg}</Text>}

					<CustomInput
						label='endereço *'
						placeholder='Digite seu endereço'
						value={userAddress.street}
						onChange={e => onChangeAddress('street', e.target.value)}
					/>

					<View className='flex gap-4'>
						<CustomInput
							label='número *'
							placeHolder='Nº'
							value={userAddress.number}
							onChange={e => onChangeAddress('number', e.target.value)}
						/>

						<CustomInput
							label='complemento (opcional)'
							placeHolder='Ex: Apto 123'
							value={userAddress.complement}
							onChange={e => onChangeAddress('complement', e.target.value)}
						/>
					</View>

					<CustomInput
						label='bairro *'
						placeHolder='Digite seu bairro'
						value={userAddress.neighborhood}
						onChange={e => onChangeAddress('neighborhood', e.target.value)}
					/>

					<View className='flex gap-4'>
						<View className='w-1/2'>
							<CustomInput
								id='frm_city'
								label='cidade *'
								placeHolder='Digite sua cidade'
								value={userAddress.city}
								onChange={e => onChangeAddress('city', e.target.value)}
							/>
						</View>

						<View className='w-1/2 flex flex-col justify-between gap-1'>
							<Text className='text-sm'>estado *</Text>

							<Select
								onChange={e => setField('state', e.target.value)}
								value={userAddress.state}
								className='w-full !h-9 !min-h-9 !rounded-none font-normal'>
								{UF.map(option => (
									<Select.Item
										key={option.value}
										value={option.value}>
										{option.label}
									</Select.Item>
								))}
							</Select>
						</View>
					</View>

					<CustomInput
						label='destinatário *'
						placeHolder='Digite o nome do destinatário'
						value={userAddress.receiverName}
						onChange={e => onChangeAddress('receiverName', e.target.value)}
					/>

					<CustomInput
						label='informações adicionais'
						placeHolder='informações adicionais ou uma referência'
						value={userAddress.referencePoint}
						onChange={e => onChangeAddress('referencePoint', e.target.value)}
					/>
				</View>

				{error && (
					<View className='p-4'>
						<Text className='text-sm text-red-500 font-bold text-center block'>{error}</Text>
					</View>
				)}
			</View>

			<BottomInset />

			<BottomFixed>
				<CustomButton
					isLoading={loading}
					onClick={onSaveAddress}
					label='Continuar'
				/>
			</BottomFixed>
		</Page>
	)
}
