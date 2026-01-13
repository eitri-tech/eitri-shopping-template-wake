import Eitri from 'eitri-bifrost'
import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText } from 'shopping-wake-template-shared'

import { getCms } from '../services/CmsService'
import { logScreenView } from '../services/TrackingService'
import { useLocalShoppingCart } from '../providers/LocalCart'

import HomeSkeleton from '../components/HomeSkeleton/HomeSkeleton'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
import { NotificationProvider } from '../components/Notification/NotificationProvider'

let history = {}
export default function LandingPage(props) {
	const { location } = props
	const PAGE = location?.state?.landingPage || 'LandingPage'
	const title = location?.state?.title || ''

	const { cart, startCart } = useLocalShoppingCart()
	const [cmsContent, setCmsContent] = useState(null)
	// const [keyProduct, setKeyProduct] = useState(new Date().getTime())

	useEffect(() => {
		window.scroll(0, history.scrollTop || 0)
		initPage()

		Eitri.navigation.addOnResumeListener(() => {
			logScreenView(PAGE, 'LandingPage')
			loadCart()
		})

		return () => {
			Eitri.navigation.clearOnResumeListener()
		}
	}, [])

	const initPage = async () => {
		loadCart()

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
		logScreenView(PAGE, 'LandingPage')

		await loadCms()
		window.scroll(0, 0)
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
			const landingPage = location?.state?.landingPage
			if (landingPage) {
				const contents = await getCms(landingPage)
				if (contents?.length > 0) {
					setCmsContent(contents)
				}
			}
		} catch (e) {
			console.error('Error loadCms: ', e)
		}
	}

	return (
		<NotificationProvider>
			<Page
				title={PAGE}
				statusBarTextColor='black'>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={title} />
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
