import Eitri from 'eitri-bifrost'
import {
	BottomInset,
	CustomButton,
	CustomInput,
	FloatNotification,
	HeaderContentWrapper,
	HeaderReturn
} from 'shopping-wake-template-shared'
import BottomFixed from '../components/BottomFixed/BottomFixed'
import StepIndicator from '../components/StepIndicator/StepIndicator'
import { customerCompletePartialRegistration } from '../services/CustomerServices'
import { sendLogError } from '../services/TrackingService'
import { parseBrazilPhone, parseToISODate } from '../utils/Util'

export default function SimpleCustomer(props) {
	const [duplicatedCpfError, setDuplicatedCpfError] = useState(false)

	const [userData, setUserData] = useState({})
	const [errors, setErrors] = useState({})

	const [changedBirthDate, setChangedBirthDate] = useState(false)
	const [loading, setLoading] = useState(false)

	const email = props.location?.state?.email
	const customerAccessToken = props.location?.state?.customerAccessToken

	const [notification, setNotification] = useState({
		show: false,
		message: '',
		secondMessage: '',
		childrenHtml: '',
		duration: 3500
	})

	useEffect(() => {
		setField('email', email)
		window.scroll(0, 0)
	}, [])

	const capitalizeWords = text => text?.replace(/\b\w/g, c => c.toUpperCase()) ?? ''

	const setField = (field, value) => {
		if (field === 'birthDate') setChangedBirthDate(true)

		setUserData(prev => ({
			...prev,
			[field]: value
		}))

		setErrors(prev => ({ ...prev, [field]: '' }))
	}

	const sendWhatsAppHelp = () => {
		const phone = '5511999998888'
		const message = encodeURIComponent('Olá, estou com problema para logar no app.')
		const url = `https://api.whatsapp.com/send/?phone=${phone}&text=${message}&type=phone_number&app_absent=0`

		Eitri.openBrowser({ url })
	}

	const goToHome = async () => {
		Eitri.navigation.navigate({ path: 'Home', replace: true })
	}

	useEffect(() => {
		const handleClick = e => {
			if (e.target.closest('.ajuda-btn')) sendWhatsAppHelp()
			if (e.target.closest('.alterar-email-btn')) goToHome()
		}

		document.addEventListener('click', handleClick)
		return () => document.removeEventListener('click', handleClick)
	}, [])

	const handleSaveUserData = async () => {
		try {
			setLoading(true)

			const requiredFields = ['customerName', 'cpf', 'birthDate', 'phoneNumber']

			const fieldLabels = {
				customerName: 'Nome completo',
				cpf: 'CPF',
				birthDate: 'Data de nascimento',
				phoneNumber: 'Celular'
			}

			const newErrors = {}

			requiredFields.forEach(field => {
				if (!userData[field] || userData[field].trim() === '') {
					const fieldLabel = fieldLabels[field] || field

					newErrors[field] = `${fieldLabel} é obrigatório`
				}
			})

			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors)
				return
			}

			const formattedNumber = parseBrazilPhone(userData?.phoneNumber)
			const payload = {
				cpf: userData.cpf,
				customerType: 'PERSON',
				email: userData?.email,
				fullName: userData?.customerName,
				birthDate: parseToISODate(userData?.birthDate, changedBirthDate),
				primaryPhoneAreaCode: formattedNumber?.area,
				primaryPhoneNumber: formattedNumber?.numberFormatted,
				newsletter: false
			}

			await customerCompletePartialRegistration(customerAccessToken?.token, payload)

			Eitri.navigation.navigate({
				path: 'AddressForm',
				replace: true,
				state: {
					comeFromSimpleLogin: true,
					customerName: userData?.customerName
				}
			})
		} catch (e) {
			const cpfHasExist = e?.message?.includes('CPF já existe')
			const invalidCpf = e?.message?.includes('CPF inválido')
			const invalidCustomerName = e?.message?.includes('Por favor, insira seu nome e sobrenome')
			const invalidPhoneNumber = e?.message?.includes("'Primary Phone Area Code' must not be empty.")

			if (cpfHasExist) {
				setErrors(prev => ({ ...prev, ['cpf']: 'CPF já existe' }))

				setNotification({
					message: 'Não foi possível logar!',
					childrenHtml: `<div class="flex flex-col gap-2"><span class='text-sm font-light'>Seu CPF já existe em nossa base com outro e-mail de cadastro.</span><div class="flex mt-1 gap-1" ><a class="alterar-email-btn bg-primary-100 italic font-serif text-sm text-accent-300 w-32 h-9 flex justify-center items-center">Alterar e-mail</a> <a class="ajuda-btn bg-primary-100 italic font-serif text-sm text-accent-300 w-32 h-9 flex justify-center items-center">Ajuda</a></div></div>`,
					show: true,
					duration: 30000
				})

				return
			}

			if (invalidCpf) setErrors(prev => ({ ...prev, ['cpf']: 'CPF inválido' }))

			if (invalidCustomerName)
				setErrors(prev => ({ ...prev, ['customerName']: 'Por favor, insira seu nome e sobrenome' }))

			if (invalidPhoneNumber) {
				setErrors(prev => ({ ...prev, ['phoneNumber']: 'Celular inválido' }))

				setNotification({
					message: 'Não foi possível concluir seu cadastro',
					secondMessage: 'Celular inválido',
					show: true
				})
				return
			}

			let errMsg = e?.message

			if (typeof errMsg === 'string') {
				try {
					errMsg = JSON.parse(errMsg)
				} catch {
					// se não conseguir parsear, mantém string
				}
			}

			if (Array.isArray(errMsg)) {
				errMsg = errMsg[0]?.message || JSON.stringify(errMsg[0])
			} else if (errMsg?.message) {
				errMsg = errMsg.message
			}

			console.log('ERRORRRRRRR 1111', e?.message)
			console.log('ERRORRRRRRR 2222', errMsg)

			setNotification({
				message: 'Não foi possível concluir seu cadastro',
				secondMessage: errMsg,
				show: true
			})

			sendLogError(e, '[SimpleCustomer]handleSaveUserData', { userEmail: email })
		} finally {
			setLoading(false)
		}
	}

	return (
		<Page>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			<StepIndicator currentStep={1} />

			<View className='p-4 flex flex-col gap-4 mb-1'>
				<CustomInput
					disabled
					label='e-mail'
					value={userData.email}
					type='text'
				/>

				<CustomInput
					label='nome completo *'
					value={userData.customerName}
					onChange={e => setField('customerName', capitalizeWords(e.target.value))}
					placeholder='Digite seu nome'
					inputMode='text'
					error={errors?.customerName}
				/>

				<CustomInput
					label='cpf *'
					value={capitalizeWords(userData.cpf)}
					mask='999.999.999-99'
					variant='mask'
					onChange={e => setField('cpf', e.target.value)}
					inputMode='numeric'
					error={errors?.cpf}
				/>

				<CustomInput
					label='data de nascimento *'
					className={`${userData.birthDateErrorMsg ? 'bg-negative-300' : ''}`}
					placeholder='Ex: DD/MM/AAAA'
					mask='99/99/9999'
					variant='mask'
					value={userData.birthDate || ''}
					onChange={e => setField('birthDate', e.target.value)}
					inputMode='numeric'
					error={errors?.birthDate}
				/>

				<CustomInput
					label='celular *'
					value={userData.phoneNumber || ''}
					mask='(99) 99999-9999'
					variant='mask'
					onChange={e => setField('phoneNumber', e.target.value)}
					type='text'
					inputMode='numeric'
					error={errors?.phoneNumber}
				/>
			</View>

			<BottomInset />

			<BottomFixed>
				<CustomButton
					isLoading={loading}
					label='Continuar'
					onClick={handleSaveUserData}></CustomButton>
			</BottomFixed>

			<FloatNotification
				showNotification={notification?.show}
				title={notification?.message}
				subTitle={notification?.secondMessage}
				childrenHtml={notification?.childrenHtml}
				duration={notification?.duration}
				onCloseNotification={() => {
					setNotification({ show: false, message: '', secondMessage: '' })
				}}
				functionExitNotification={() => {
					setNotification({ show: false, message: '', secondMessage: '' })
				}}
				status='negative'
				showLabel={false}
			/>
		</Page>
	)
}
