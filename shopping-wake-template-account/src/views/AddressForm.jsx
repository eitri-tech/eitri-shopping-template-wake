import Eitri from 'eitri-bifrost'
import HeaderTemplate from '../components/Shared/HeaderTemplate/HeaderTemplate'
import BottomFixed from '../components/BottomFixed/BottomFixed'
import { addAddressImpl, getAddressByZipCode, updateAddressImpl } from '../services/CustomerService'
import CustomDropdown from '../components/CustomDropdown'
import { UF } from '../utils/Constants'
import { logScreenView } from '../services/TrackingService'
import { CustomInput, HeaderContentWrapper, HeaderReturn } from 'shopping-wake-template-shared'

export default function AddressForm(props) {
	const PAGE = 'Account - Editar endereço'

	const [userAddress, setUserAddress] = useState({})
	const [isNewAddress, setIsNewAddress] = useState(false)

	useEffect(() => {
		startForm()
		logScreenView(PAGE)
	}, [])

	const startForm = async () => {
		const currentAddress = props?.location?.state?.state

		if (currentAddress === 'newAddress') {
			setIsNewAddress(true)
		} else {
			setUserAddress({
				id: currentAddress.id,
				receiverName: currentAddress.receiverName || '',
				cep: currentAddress.cep || '',
				street: currentAddress.address || '',
				number: currentAddress.addressNumber || '',
				complement: currentAddress.addressDetails || '',
				city: currentAddress.city || '',
				state: currentAddress.state || '',
				neighborhood: currentAddress.neighborhood || '',
				referencePoint: currentAddress.referencePoint || ''
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
					street: `${address?.street || ''}`,
					neighborhood: address?.neighborhood || '',
					city: address?.city || '',
					state: address?.state || '',
					cep: zipCode,
					cepErrorMsg: ''
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

	const onSaveAddress = async () => {
		try {
			const requiredFields = ['cep', 'city', 'receiverName', 'state']
			let hasErrors = false

			requiredFields.forEach(field => {
				if (!userAddress[field]) {
					setField(`${field}ErrorMsg`, `O campo é obrigatório`)
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
				await updateAddressImpl(userAddress)
			} else {
				console.log('Criando novo endereço...')
				await addAddressImpl(userAddress)
			}

			Eitri.navigation.back()
		} catch (error) {
			console.error('Erro ao salvar o endereço:', error.message)
			if (!error.message.includes('Campos obrigatórios')) {
				console.error('Erro inesperado:', error)
			}
		}
	}

	const backToPage = () => {
		Eitri.navigation.back()
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<View className='flex flex-row justify-start items-center gap-4'>
					<HeaderReturn onClick={backToPage} />
					<Text className=''>Endereço de entrega</Text>
				</View>
			</HeaderContentWrapper>

			<View className='p-4 flex flex-col gap-4 mb-4'>
				<Text
					fonteWeight='bold'
					fontSize='large'>
					{isNewAddress ? 'Adicione seu novo endereço de entrega' : 'Edite seu endereço de entrega'}
				</Text>

				<View className='flex flex-col gap-2 w-full'>
					<CustomInput
						label='Destinatário'
						id='frm_receiverName'
						placeHolder='Digite o nome do destinatário'
						value={userAddress.receiverName}
						onChange={value => setField('receiverName', value.target.value)}
					/>
					{userAddress.receiverNameErrorMsg && (
						<Text color='text-error'>{userAddress.receiverNameErrorMsg}</Text>
					)}
				</View>

				<View className='flex flex-col gap-2 w-full'>
					<CustomInput
						id='frm_cep'
						label='CEP *'
						mask='99999-999'
						variant='mask'
						placeholder='Digite o CEP'
						value={userAddress.cep || ''}
						onChange={value => onZipCodeChange(value.target.value)}
						inputMode='numeric'
						backgroundColorError={userAddress.cepErrorMsg ? 'negative-300' : ''}
					/>
					{userAddress.cepErrorMsg && <Text color='text-error'>{userAddress.cepErrorMsg}</Text>}
				</View>

				<CustomInput
					label='Logradouro (Rua, Avenida, Travessa)'
					placeholder='Digite o logradouro'
					value={userAddress.street}
					onChange={value => setField('street', value.target.value)}
				/>

				<CustomInput
					label='Número'
					placeHolder='Digíte o número'
					value={userAddress.number}
					onChange={value => setField('number', value.target.value)}
				/>
				<CustomInput
					label='Complemento (opcional)'
					placeHolder='Digite o complemento'
					value={userAddress.complement}
					onChange={value => setField('complement', value.target.value)}
				/>

				<View className='mt-4 flex w-full flex-col gap-1'>
					<Text>Estado</Text>
					<Select
						id='frm_state'
						className={`!rounded-none w-full !min-h-8 !h-8 font-normal`}
						value={userAddress.state}
						maxLength='2'
						nextInputOnSubmit='frm_city'
						onChange={e => setField('state', e.target.value)}>
						{UF.map(option => (
							<Select.Item
								key={option.value}
								value={option.value}>
								{option.label}
							</Select.Item>
						))}
					</Select>
				</View>

				<CustomInput
					id='frm_city'
					label='Cidade'
					placeHolder='Digite sua cidade'
					value={userAddress.city}
					onChange={value => setField('city', value.target.value)}
				/>
				<CustomInput
					label='Bairro'
					placeHolder='Digite seu bairro'
					value={userAddress.neighborhood}
					onChange={value => setField('neighborhood', value.target.value)}
				/>

				<CustomInput
					label='Informações adicionais'
					placeHolder='Informações adicionais ou uma referência'
					value={userAddress.referencePoint}
					onChange={value => setField('referencePoint', value.target.value)}
				/>

				<Button
					className='bg-primary text-primary-content w-full !h-9 !min-h-9 !font-medium text-xs !rounded-none'
					onClick={onSaveAddress}>
					Salvar
				</Button>
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
