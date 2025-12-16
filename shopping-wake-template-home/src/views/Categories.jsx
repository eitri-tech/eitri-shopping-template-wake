import { HeaderContentWrapper, HeaderText, BottomInset } from 'shopping-wake-template-shared'
import Eitri from 'eitri-bifrost'
import { View } from 'eitri-luminus'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { openCart, openHotsite, openPageError } from '../services/NavigationService'
import { getFormatedCategories } from '../services/ProductService'
import { logError, logScreenView } from '../services/TrackingService'
import iconClose from '../assets/images/close.svg'
import iconSearch from '../assets/images/search.svg'
import CategoryMenuItem from '../components/category/CategoryMenuItem'
import SearchInput from '../components/SearchInput/SearchInput'
import CategoryListSwipe from '../components/CategoryListSwipe/CategoryListSwipe'

export default function Categories(props) {
	const PAGE = 'Categorias'

	const { startCart } = useLocalShoppingCart()
	const [categories, setCategories] = useState(null)

	useEffect(() => {
		init()
		Eitri.navigation.setOnResumeListener(() => {
			logScreenView(PAGE, 'Categories')
			startCart().catch(e => {
				console.error('Error startCart: ', e)
			})
		})
	}, [])

	const init = async () => {
		await verifyRegion()
		
		getAllCategories()

		const startParams = await Eitri.getInitializationInfos()
		if (!startParams?.tabIndex) {
			logScreenView(PAGE, 'Categories')
		}
	}

	const getAllCategories = async () => {
		try {
			// Available groups: 19 ("Menu Geral"), 24 ("Menu Novo 2024"), 25 ("Menu 2025")
			// Use null as third parameter to show all categories without filter
			const result = await getFormatedCategories('', null, group => group.menuGroupId == 19)
			if (result && result.length > 0) {
				setCategories(result)
				return
			}

			openPageError()
		} catch (e) {
			logError('Categories getAllCategories', e)
			console.error('getAllCategories Error:', e)
		}
	}

	const goToHotsite = (url, title) => {
		if (url) {
			openHotsite(url, title, {})
			return
		}
	}

	return (
		<Page
			title={PAGE}
			statusBarTextColor='black'>
			<HeaderContentWrapper>
				<HeaderText text={'Categorias'} />
			</HeaderContentWrapper>

			<CategoryListSwipe
				content={categories}
				onSelect={item => goToHotsite(item.link, item.name)}
			/>

			<BottomInset />
		</Page>
	)
}
