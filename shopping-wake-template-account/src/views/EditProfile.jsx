import Eitri from 'eitri-bifrost'
import { Button, Select } from 'eitri-luminus'
import {
	CustomInput,
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	LoadingComponent
} from 'shopping-wake-template-shared'
import { getCustomer, updateCustomer } from '../services/CustomerService'
import { navigate, openBrowser, PAGES } from '../services/NavigationService'
import { formatCPF, formatDate, formatPhone, parseToISODate } from '../utils/Util'

export default function EditProfile(props) {
	const PAGE = 'Editar Dados Pessoais'
	const capitalizeWords = text => text?.replace(/\b\w/g, c => c.toUpperCase()) ?? ''

	const [isLoading, setIsLoading] = useState(true)
	const [userData, setUserData] = useState({})
	const [changedBirthDate, setChangedBirthDate] = useState(false)

	const [errorMessages, setErrorMessages] = useState({})
	const [requestError, setRequestError] = useState(false)
	const [successMessage, setSuccessMessage] = useState(false)

	useEffect(() => {
		window.scroll(0, 0)
		init()
	}, [])

	const mapGenderToEnum = gender => {
		switch (gender?.toLowerCase()) {
			case 'masculino':
			case 'male':
				return 'MALE'
			case 'feminino':
			case 'female':
				return 'FEMALE'
			default:
				return 'MALE'
		}
	}

	const mapPhone = phone => {
		const digits = phone.replace(/\D/g, '')
		return `${digits.slice(0, 7)}-${digits.slice(7)}`
	}

	const init = async () => {
		setIsLoading(true)
		try {
			const customerData = await getCustomer()

			const transformedData = {
				...customerData,
				birthDate: formatDate(customerData.birthDate),
				gender: customerData.gender
			}

			setUserData(transformedData)
		} catch (e) {
			console.error('Error fetching customer data:', e)
		} finally {
			setIsLoading(false)
		}
	}

	const setField = (field, value) => {
		if (field === 'birthDate') setChangedBirthDate(true)

		setUserData(prev => ({
			...prev,
			[field]: value
		}))

		setErrorMessages(prev => ({
			...prev,
			[field]: ''
		}))
	}

	const handleUpdateUserData = async () => {
		setRequestError(false)
		setIsLoading(true)
		setSuccessMessage(false)

		try {
			const payload = {
				fullName: userData.customerName?.trim(),
				primaryPhoneNumber: mapPhone(userData.phoneNumber),
				birthDate: parseToISODate(userData.birthDate).substring(0, 10),
				gender: mapGenderToEnum(userData.gender)
			}

			const resp = await updateCustomer(payload)
			setSuccessMessage(true)
		} catch (e) {
			console.error('Error updating customer data:', e)
			setRequestError(true)
		}
		setIsLoading(false)
	}

	const handleRemoveAccount = async () => {
		try {
			openBrowser(PAGE, 'https://ddddddd.cloudfront.net/?app=app', true)
		} catch (e) {
			console.error('Error removing account:', e)
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
					<Text className=''>Editar Perfil</Text>
				</View>
			</HeaderContentWrapper>

			<LoadingComponent
				fullScreen
				isLoading={isLoading}
			/>

			<View className='p-4 flex flex-col gap-4 mb-1'>
				<CustomInput
					label='Nome completo'
					value={capitalizeWords(userData.customerName)}
					onChange={e => setField('customerName', e.target.value)}
					placeholder='Digite seu nome'
					type='text'
				/>

				<CustomInput
					label='Cpf'
					disabled
					value={formatCPF(userData.cpf || '')}
					type='text'
					className='!pl-2'
				/>

				<CustomInput
					label='E-mail'
					value={userData.email}
					disabled
					type='text'
				/>

				<CustomInput
					label='Data de nascimento'
					className={`${userData.birthDateErrorMsg ? 'bg-error' : ''}`}
					placeholder='Ex: DD/MM/AAAA'
					mask='99/99/9999'
					variant='mask'
					value={userData.birthDate || ''}
					onChange={e => setField('birthDate', e.target.value)}
					inputMode='numeric'
				/>

				<View className='flex flex-col gap-1 w-full'>
					<Text className='text-sm'>Sexo</Text>

					<Select
						className={`!h-9 !min-h-9 !rounded-none w-full ${userData.genderErrorMsg ? 'bg-error' : ''}`}
						value={mapGenderToEnum(userData.gender) || ''}
						onChange={e => setField('gender', e.target.value)}>
						<Select.Item value='MALE'>Masculino</Select.Item>

						<Select.Item value='FEMALE'>Feminino</Select.Item>
					</Select>
				</View>

				<CustomInput
					label='Celular'
					value={formatPhone(userData.phoneNumber || '')}
					mask='(99) 99999-9999'
					variant='mask'
					onChange={e => setField('phoneNumber', e.target.value)}
					type='text'
					inputMode='numeric'
				/>
			</View>

			{/* TO-DO:  descobrir o campo de newsletter */}

			{/* <View direction='row' gap={10} marginTop='display' sendFocusToInput alignItems='center'>
				<Checkbox
					name='newsletter'
					value={userData.newsletter}
					checked={userData.newsletter}
					onChange={value => setField('newsletter', value?.checked)}
				/>
				<Text>Quero receber as novidades por e-mail.</Text>
			</View> */}

			<View className='px-4 flex flex-col items-center justify-center gap-4 mb-4'>
				{requestError && (
					<Text className={`text-sm text-error w-full text-center font-bold`}>
						Houve uma falha ao salvar seus dados. Revise os campos e tente novamente.
					</Text>
				)}
				{successMessage && (
					<Text className={`text-sm text-success w-full text-center font-bold`}>Salvo com sucesso</Text>
				)}

				<Button
					className='bg-primary text-primary-content w-full !h-9 !min-h-9 !font-medium text-xs !rounded-none'
					onClick={handleUpdateUserData}>
					Salvar
				</Button>

				{/* TO-DO: Add GA event */}
				<View onClick={handleRemoveAccount}>
					<Text className='font-medium underline'>Solicitar exclusão da conta</Text>
				</View>
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
