// import { HeaderTemplate } from 'shopping-wake-template-shared'
import Eitri from 'eitri-bifrost'
import { requestLogin } from '../services/CustomerServices'
import { logScreenView } from '../services/TrackingService'

export default function UnloggedError() {
	const PAGE = '[Erro] Usuário não logado'

	useEffect(() => {
		logScreenView(PAGE)
	}, [])

	const doLogin = async () => {
		requestLogin()
			.then(() => {
				Eitri.navigation.navigate({ path: 'Home', replace: true })
			})
			.catch(error => {})
	}

	return (
		<Page title={PAGE}>
			{/*<HeaderTemplate text={''} />*/}

			<View className='w-screen h-screen p-4 flex flex-col justify-center items-center'>
				<Text className='text-sm font-medium'>Faça login para finalizar sua compra</Text>

				<View className='mt-6'>
					<View
						onClick={doLogin}
						className='cursor-pointer py-2'>
						<Text className='text-xs underline'>Fazer login</Text>
					</View>
				</View>
			</View>
		</Page>
	)
}
