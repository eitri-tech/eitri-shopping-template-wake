import Eitri from 'eitri-bifrost'
import { Wake } from 'eitri-shopping-wake-shared'
import { CustomButton } from 'shopping-wake-template-shared'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { openCart } from '../services/NavigationService'
import { screenView } from '../services/TrackingService'

export default function ErrorNotFound(props) {
	const PAGE = 'Produto não encontrado'
	const { cart } = useLocalShoppingCart()

	useEffect(() => {
		window.scroll(0, 0)
		getHeaderColors()
		screenView(PAGE, 'ErrorNotFound')
	}, [])

	const goToHome = () => {
		Eitri.close()
	}

	const navigateCart = () => {
		openCart(cart?.cartId)
	}

	const getHeaderColors = async () => {
		const remoteConfig = await Eitri.environment.getRemoteConfigs()

		window.headerColors = {
			headerBackgroundColor: remoteConfig?.appConfigs?.style?.headerBackgroundColorToken || 'primary-900',
			headerContentColor: remoteConfig?.appConfigs?.style?.headerContentColorToken || 'accent-100'
		}
	}

	return (
		<Page bottomInset>
			<View className='p-6 flex flex-col justify-center items-center gap-[30px] bg-neutral-100 h-screen'>
				<Text className='text-lg font-bold text-center'>PRODUTO NÃO ENCONTRADO</Text>

				<Text className='text-sm text-center'>
					Desculpe, o produto que você está tentando acessar se encontra indisponível.
				</Text>

				<CustomButton
					backgroundColor='primary-500'
					borderRadius='none'
					label='VOLTAR PARA A HOME'
					wide
					onPress={() => goToHome()}
				/>
			</View>
		</Page>
	)
}
