import Eitri from 'eitri-bifrost'
import { Button, Loading, View } from 'eitri-luminus'
import { CustomButton, CustomInput, HeaderContentWrapper, HeaderReturn } from 'shopping-wake-template-shared'
import HeaderTemplate from '../components/Shared/HeaderTemplate/HeaderTemplate'
import { sendRecoveryEmail } from '../services/CustomerService'
import { logScreenView } from '../services/TrackingService'
import AlertMessage from '../components/AlertMessage/AlertMessage'

export default function PasswordReset() {
	const PAGE = 'Recuperar senha'

	const [userLogin, setUserLogin] = useState('')
	const [loadingSendingEmail, setLoadingSendingEmail] = useState(false)
	const [emailSent, setEmailSent] = useState(false)

	const [alertMessage, setAlertMessage] = useState('')

	useEffect(() => {
		window.scroll(0, 0)
		logScreenView(PAGE)
	}, [])

	const _sendRecoveryEmail = async () => {
		if (!userLogin) return

		try {
			setLoadingSendingEmail(true)

			const resp = await sendRecoveryEmail(userLogin)

			if (resp?.customerPasswordRecovery?.isSuccess) {
				setEmailSent(true)
			} else {
				setAlertMessage('Falha ao enviar o e-mail de recuperação')
			}
		} catch (error) {
			setAlertMessage('Falha ao enviar o e-mail de recuperação')
		}

		setLoadingSendingEmail(false)
	}

	const onInputChange = value => {
		setUserLogin(value)
		setEmailSent(false)
		setAlertMessage('')
	}

	const backToPage = () => {
		Eitri.navigation.back()
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<View className='flex flex-row justify-start items-center gap-4'>
					<HeaderReturn onClick={backToPage} />
					<Text className=''>Redefinição de senha</Text>
				</View>
			</HeaderContentWrapper>

			<View className='flex flex-col justify-center w-full mt-8 p-4 gap-4'>
				<View
					direction='column'
					justifyContent='center'
					alignItems='center'>
					<Text fontSize='large'>Confirme seu endereço de e-mail para continuar</Text>
				</View>

				<CustomInput
					placeholder='exemplo@exemplo.com.br'
					autoCapitalize='off'
					type='email'
					value={userLogin}
					onChange={e => onInputChange(e.target.value)}
				/>

				<Button
					className='!bg-black !h-8 !min-h-8 w-full text-xs !font-normal !text-white !rounded-none'
					disabled={!userLogin}
					onClick={_sendRecoveryEmail}>
					Enviar
				</Button>

				{loadingSendingEmail && (
					<View className='flex justify-center items-center w-full my-4'>
						<Loading className='loading-sm' />
					</View>
				)}

				{emailSent && (
					<AlertMessage
						type='success'
						onDismiss={setEmailSent}
						duration={10}
						message={`Um e-mail de recuperação foi enviado para ${userLogin}`}
						className='flex justify-center w-full text-center py-4 text-bold'
					/>
				)}

				{alertMessage && (
					<AlertMessage
						type='negative'
						onDismiss={setAlertMessage}
						duration={7}
						message={alertMessage}
						className='flex justify-center w-full text-center py-4 text-bold'
					/>
				)}
			</View>
		</Page>
	)
}
