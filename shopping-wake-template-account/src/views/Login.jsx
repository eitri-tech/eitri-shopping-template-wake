import Eitri from 'eitri-bifrost'
import { CustomInput, HeaderContentWrapper, HeaderReturn, ProgressScreen } from 'shopping-wake-template-shared'
import { doLogin, notifyLoginToEitri } from '../services/CustomerService'
import { navigate, PAGES } from '../services/NavigationService'
import { logScreenView } from '../services/TrackingService'
import ContentTitle from '../components/ContentTitle/ContentTitle'
import AlertMessage from '../components/AlertMessage/AlertMessage'

export default function Login(props) {
	const PAGE = 'Login'

	const { location } = props
	const origin = location?.state?.origin
	const redirectTo = location?.state?.redirectTo

	const state = props?.history?.location?.state

	const [userLogin, setUserLogin] = useState('')
	const [password, setPassword] = useState('')

	const [showLoginErrorAlert, setShowLoginErrorAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState('')

	useEffect(() => {
		window.scroll(0, 0)
		logScreenView(PAGE)
	}, [])

	const signIn = async () => {
		if (userLogin && password) {
			try {
				const result = await doLogin(userLogin, password)
				if (result === null) {
					setAlertMessage('O usuário informado não está cadastrado')
					return
				}

				// Envia notificação para o eitri assincronamente
				notifyLoginToEitri()

				if (state?.closeAppAfterLogin) {
					Eitri.close()
				} else if (state?.redirectToAfterLogin) {
					navigate(state?.redirectToAfterLogin, {}, true)
				} else {
					navigate(PAGES.HOME, {}, true)
				}
			} catch (e) {
				setAlertMessage('Falha ao efetuar login, verifique email e senha')
				console.log('SignInError', e)
			}
		}
	}

	const goToPasswordResetPage = () => navigate(PAGES.PASSWORD_RESET)

	const register = async () => {
		navigate(PAGES.REGISTER)
	}

	const backToPage = () => {
		Eitri.navigation.back()
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<View className='flex flex-row justify-start items-center gap-4'>
					<HeaderReturn onClick={backToPage} />
					<Text className=''>Acesso</Text>
				</View>
			</HeaderContentWrapper>

			<View className='flex flex-col justify-center w-full p-4'>
				<ContentTitle className='text-center'>Entrar com E-mail e Senha</ContentTitle>

				<View className='flex flex-col w-full gap-4 mt-8'>
					<CustomInput
						label='E-mail'
						value={userLogin}
						type='email'
						placeholder='exemplo@exemplo.com.br'
						onChange={e => setUserLogin(e.target.value)}
						showClearInput={false}
						required
					/>

					<View className='flex flex-col gap-1'>
						<CustomInput
							label='Senha'
							placeholder='Digite sua senha'
							value={password}
							type='password'
							onChange={e => setPassword(e.target.value)}
							required
						/>
					</View>

					<Button
						className='!bg-primary !text-primary-content !h-8 !min-h-8 w-full text-xs !font-normal mt-2 !rounded-none'
						onClick={signIn}>
						Entrar
					</Button>

					<View
						className='flex justify-center'
						onClick={register}>
						<Text className='text-base'>
							Não tem uma conta? <Text className='font-medium underline'>Cadastre-se</Text>
						</Text>
					</View>

					<View
						onClick={goToPasswordResetPage}
						className='flex justify-center'>
						<Text className='text-sm underline'>Esqueceu sua senha?</Text>
					</View>
				</View>

				{alertMessage && (
					<AlertMessage
						type='negative'
						onDismiss={setAlertMessage}
						duration={7}
						message={alertMessage}
						className='justify-center w-full text-center py-4'
					/>
				)}
			</View>
		</Page>
	)
}
