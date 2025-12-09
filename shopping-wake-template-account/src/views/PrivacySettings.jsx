import { HeaderContentWrapper, HeaderReturn, HeaderText } from 'shopping-wake-template-shared'
import { navigate, PAGES } from '../services/NavigationService'

export default function PrivacySettings(props) {
	const PAGE = 'Configuração de privacidade'

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper
				className='flex justify-between bg-accent-300 py-2'
				scrollEffect={false}>
				<HeaderReturn />

				<HeaderText
					className='w-fit'
					text={PAGE}
				/>

				<View width={20} />
			</HeaderContentWrapper>

			<View className='flex flex-grow flex-col items-center justify-center h-[calc(100vh-10vh)]'>
				<Text className='mb-[18px] w-full max-w-[300px] text-center text-xs text-neutral-900'>
					Pra acessar as preferências de privacidade, você precisa ter um cadastro aqui no site. Se já tiver o
					cadastro, basta logar na sua conta. Se não, é preciso criar um novo cadastro, marcando a opção de
					que quer desativar nossas comunicações.
				</Text>

				<View className='flex flex-col items-center gap-2 mt-3'>
					<Button
						className='!rounded-none !min-h-8 !h-9 bg-transparent btn-outline w-[202px] border-neutral-900 !font-normal text-neutral-900 text-xs'
						onClick={() => navigate(PAGES.LOGIN, { redirectTo: 'PrivacySettings' })}>
						Fazer login
					</Button>

					<Button
						className='!border-none !min-h-8 !h-9 bg-transparent w-[202px] !font-normal text-neutral-900 text-xs !underline !shadow-none'
						onClick={() => navigate(PAGES.REGISTER, { redirectTo: 'PrivacySettings' })}>
						Criar conta
					</Button>
				</View>
			</View>
		</Page>
	)
}
