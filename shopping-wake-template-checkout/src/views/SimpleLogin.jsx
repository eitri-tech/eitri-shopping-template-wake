import { CustomButton, CustomInput, HeaderReturn, HeaderContentWrapper } from 'shopping-wake-template-shared'
import { customerSimpleLoginVerifyAnswer, simpleLogin } from '../services/CustomerServices'
import SimpleLoginQuestions from '../components/SimpleLoginQuestions/SimpleLoginQuestions'
import Eitri from 'eitri-bifrost'
import { sendLogError } from '../services/TrackingService'

export default function SimpleLogin(props) {
	const [email, setEmail] = useState('')
	const [startSimpleLoginContent, setStartSimpleLoginContent] = useState()
	const [loading, setLoading] = useState(false)

	const [notification, setNotification] = useState({
		show: false,
		message: '',
		secondMessage: '',
		childrenHtml: '',
		duration: 3500
	})

	const userSimpleLoginStart = async () => {
		try {
			setLoading(true)

			if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				setNotification({
					message: 'E-mail inválido',
					secondMessage: 'Tente novamente com um e-mail válido.',
					show: true
				})
				return
			}

			const simpleLoginResponse = await simpleLogin(email)

			if (simpleLoginResponse?.type === 'NEW') {
				Eitri.navigation.navigate({
					path: 'SimpleCustomer',
					state: {
						email: email,
						customerAccessToken: simpleLoginResponse?.customerAccessToken
					},
					replace: true
				})
				return
			}

			setStartSimpleLoginContent(simpleLoginResponse)
		} catch (error) {
			setNotification({
				message: 'E-mail inválido',
				secondMessage: 'Tente novamente com um e-mail válido.',
				show: true
			})

			sendLogError(error, '[SimpleLogin]userSimpleLoginStart', { userEmail: email })
		} finally {
			setLoading(false)
		}
	}

	const handleUserLogin = async (questionId, answerId) => {
		try {
			const result = await customerSimpleLoginVerifyAnswer(email, questionId, answerId)
			if (result.customerAccessToken) {
				Eitri.navigation.navigate({
					path: 'Home',
					replace: true
				})
				return
			}
			setStartSimpleLoginContent(result)
		} catch (error) {
			sendLogError(error, '[SimpleLogin]handleUserLogin', { userEmail: email })
		}
	}

	return (
		<Page>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			{!startSimpleLoginContent && (
				<View className='flex flex-col w-full h-[80vh] justify-center items-center px-10'>
					<View className='py-4 flex flex-col w-full gap-0.5 items-center'>
						<Text className='text-base font-medium text-center mb-1'>Entre com seu e-mail</Text>
					</View>

					<View className='py-4 flex flex-col gap-2 w-full max-w-96'>
						<CustomInput
							label='E-mail'
							placeholder='exemplo@gmail.com'
							type='email'
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>

						<CustomButton
							disabled={!email}
							isLoading={loading}
							className='mt-3'
							label='Entrar'
							onClick={userSimpleLoginStart}
						/>
					</View>
				</View>
			)}

			{startSimpleLoginContent && (
				<View className='flex flex-col justify-center gap-4 p-4 pt-8'>
					<SimpleLoginQuestions
						question={startSimpleLoginContent?.question}
						onSelect={handleUserLogin}
					/>
				</View>
			)}
		</Page>
	)
}
