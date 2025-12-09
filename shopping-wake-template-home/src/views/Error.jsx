import Eitri from 'eitri-bifrost'
import { CustomButton } from 'shopping-wake-template-shared'
import { logScreenView } from '../services/TrackingService'
import alertTriangleIcon from '../assets/images/alert-triangle.svg'

export default function Error(props) {
	const PAGE = 'Página de Erro'

	useEffect(() => {
		window.scroll(0, 0)
		logScreenView(PAGE, 'Error')
	}, [])

	const goBack = () => {
		Eitri.navigation.back()
	}

	return (
		<Page
			bottomInset
			topInset
			title={PAGE}>
			<View
				className='flex flex-col items-center justify-center w-full gap-8'
				height='100vh'>
				<Image
					src={alertTriangleIcon}
					width={70}
					height={70}
					className='text-secondary-900'
				/>

				<Text className='font-bold text-center'>PÁGINA NÃO ENCONTRADA</Text>

				<Text className='font-bold text-center'>
					A página que você está tentando acessar está indisponível.
				</Text>

				<View
					className='flex'
					width='70px'>
					<CustomButton
						label={'VOLTAR'}
						onClick={goBack}
					/>
				</View>
			</View>
		</Page>
	)
}
