import Eitri from 'eitri-bifrost'
import { BottomInset, HeaderContentWrapper, HeaderLogo, HeaderSearchIcon } from 'shopping-wake-template-shared'

import { startConfigure } from '../services/AppService'
import { getCmsHome } from '../services/CmsService'
import { logScreenView } from '../services/TrackingService'
import { openCart, openSearch, openWishList } from '../services/NavigationService'
import { useLocalShoppingCart } from '../providers/LocalCart'

import HomeSkeleton from '../components/HomeSkeleton/HomeSkeleton'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
import { NotificationProvider } from '../components/Notification/NotificationProvider'

let history = {}
export default function Home() {
	const PAGE = 'Home'

	const { cart, startCart, createNewCart, verifyRegion } = useLocalShoppingCart()

	const [cmsContent, setCmsContent] = useState(null)
	// const [keyProduct, setKeyProduct] = useState(new Date().getTime())

	useEffect(() => {
		window.scroll(0, history.scrollTop || 0)
		startHome()
		requestNotificationPermission()

		Eitri.navigation.setOnResumeListener(() => {
			logScreenView(PAGE, 'Home')
			refreshProductComponents()
			loadCart()
		})
	}, [])

	const requestNotificationPermission = async () => {
		try {
			let notificationPermissionStatus = await Eitri.notification.checkPermission()

			if (notificationPermissionStatus.status === 'DENIED') {
				const permissionStatus = await Eitri.notification.requestPermission()
			}
		} catch (e) {
			console.error('Erro ao solicitar permissão para notificação', e)
		}
	}

	const startHome = async () => {
		await startConfigure()

		loadCart()

		await verifyRegion()

		await resolveContent()
		await initFavorites()
	}

	const loadCart = async () => {
		try {
			startCart()
		} catch (e) {
			console.error('Error startCart: ', e)
			forceCreateNewCart()
		}
	}

	const forceCreateNewCart = async () => {
		try {
			await createNewCart()
		} catch (e) {
			console.error('Error Create new cart: ', e)
		}
	}

	const resolveContent = async () => {
		const startParams = await Eitri.getInitializationInfos()
		if (startParams) {
			const openRoute = processDeepLink(startParams)
			if (openRoute) {
				Eitri.navigation.navigate({ ...openRoute })
				return
			}
		}
		logScreenView(PAGE, 'Home')

		await loadCms()
		window.scroll(0, 0)
	}

	const processDeepLink = startParams => {
		if (startParams?.route) {
			let { route, ...rest } = startParams

			if (route.toLowerCase() === 'hotsite' && rest.value) {
				rest.url = rest.value
			} else if (route.toLowerCase() === 'search') {
				if (rest.value) {
					rest.term = rest.value
				}
			} else if (route.toLowerCase() === 'product') {
				const productId = rest.productId || rest.id || rest.value
				if (productId) {
					openProduct(productId)
				}
				return null
			}

			return { path: route, replace: true, state: { ...rest } }
		}
	}

	const initFavorites = async () => {
		// let isLoggedIn
		// try {
		// 	isLoggedIn = await Wake.customer.isLoggedIn()
		// } catch (e) {
		// 	console.error('initFavorites Error:', e)
		// }
		// if (isLoggedIn) {
		// 	await startFavorites()
		// 	return
		// }
		// // para o caso do login expirar enquanto estiver fora do app
		// resetFavorites()
	}

	const refreshProductComponents = async () => {
		// await initFavorites()
		// const newKeyProduct = new Date().getTime()
		// setKeyProduct(newKeyProduct)
	}

	const loadCms = async () => {
		try {
			const contents = await getCmsHome()
			if (contents?.length > 0) {
				setCmsContent(contents)
			}
		} catch (e) {
			console.error('Error loadCms: ', e)
		}
	}

	const navigateToCart = () => {
		openCart(cart?.cartId)
	}

	const navigateToSearch = term => {
		Eitri.navigation.navigate({ path: '/Search', state: {}, replace: false })
	}

	const navigateToWishList = term => {
		openWishList()
	}

	return (
		<NotificationProvider>
			<Page
				title={PAGE}
				statusBarTextColor='black'>
				<HeaderContentWrapper className={'justify-between'}>
					<HeaderLogo />
					<HeaderSearchIcon onClick={navigateToSearch} />
				</HeaderContentWrapper>
				<View className=''>
					<HomeSkeleton show={!cmsContent} />
					<CmsContentRender cmsContent={cmsContent} />
					<BottomInset />
				</View>
			</Page>
		</NotificationProvider>
	)
}
