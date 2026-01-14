import Eitri from 'eitri-bifrost'
import { Wake } from 'eitri-shopping-wake-shared'
import { LoadingComponent, BottomInset, HeaderContentWrapper } from 'shopping-wake-template-shared'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { startConfigure } from '../services/AppService'
import { getProduct, registerStockAlert } from '../services/ProductService'
import { addItemToCart } from '../services/CartService'
import { openCart, openPageError } from '../services/NavigationService'
import ImagesCaroussel from '../components/ImagesCaroussel/ImagesCaroussel'
import ProductAttributes from '../components/ProductAttributes/ProductAttributes'
import { formatCurrency, formatImageUrl, getWindowFilledHeight, waitForElement, waitImageLoad } from '../utils/Util'
import { resetFavorites } from '../services/FavoriteService'
import { screenView, viewItem } from '../services/TrackingService'
import Description from '../components/Description/Description'
import BuyActions from '../components/BuyActions/BuyActions'
import Infos from '../components/Infos/Infos'
import ProductRecommendation from '../components/ProductRecommendation/ProductRecommendation'
import Header from '../components/Header/Header'
import ModalAddToCartConfirmation from '../components/ModalAddToCartConfirmation/ModalAddToCartConfirmation'
import ModalConfirmStockAlert from '../components/ModalConfirmStockAlert/ModalConfirmStockAlert'

export default function Home() {
	const PAGE = 'Página de produto'

	const { startCart, cart } = useLocalShoppingCart()

	const [product, setProduct] = useState(null)
	const [selectedVariation, setSelectedVariation] = useState(null)
	const [hasVariationEnabled, setHasVariationEnabled] = useState(true)
	const [isLoading, setIsLoading] = useState(true)
	const [storeStyle, setStoreStyle] = useState(null)
	const [pdpImagesHeight, setPdpImagesHeight] = useState('100vh')
	const [storeHost, setStoreHost] = useState('')
	const [showModal, setShowModal] = useState(false)
	const [loadingBuyProduct, setLoadingBuyProduct] = useState(null)
	const [isPristine, setIsPristine] = useState(true)

	const [showModalAddToCartConfirmation, setShowModalAddToCartConfirmation] = useState(false)
	const [modalConfirmAlertStock, setModalConfirmAlertStock] = useState(false)

	const orientation = storeStyle === 'magazine' ? 'row' : 'column'

	useEffect(() => {
		window.scroll(0, 0)
		startHome()

		Eitri.navigation.setOnResumeListener(() => {
			screenView(PAGE, 'PDP')
			startCart().catch(e => {
				console.error('Error startCart: ', e)
			})
		})
	}, [])

	useEffect(() => {
		const fetchRemoteConfigs = async () => {
			const { remoteConfig, providerInfo } = await EITRI.environment.getRemoteConfigs()
			setStoreStyle(remoteConfig.appConfigs.storeStyle)
			handlerStoreHost(providerInfo)
		}

		fetchRemoteConfigs()
	}, [])

	useEffect(() => {
		if (product) {
			refreshProductAttributes()
		}
	}, [selectedVariation])

	const refreshProductAttributes = async () => {
		const selected = Object.keys(selectedVariation)
			.filter(attr => selectedVariation[attr] !== null)
			.map(attr => ({
				attributeId: parseInt(attr),
				value: selectedVariation[attr]
			}))
		const refreshProduct = await getProduct(product.productId, selected)
		if (refreshProduct) {
			setProduct(refreshProduct)
		}
	}

	const handlerStoreHost = providerInfo => {
		if (providerInfo?.host) {
			let host = providerInfo.host.toLowerCase()
			if (!host.startsWith('http')) {
				host = `https://${host}`
			}
			if (host.endswith('/')) {
				host = host.replace(/\/+$/, '')
			}
			setStoreHost(host)
		}
	}

	const startHome = async productId => {
		setIsLoading(true)
		await startConfigure()
		await resolveRedirectAndCartAndProduct(productId)
		setIsLoading(false)
	}

	const refreshPage = async productId => {
		setIsLoading(true)
		setShowModal(false)
		await resolveRedirectAndCartAndProduct(productId)
		setIsLoading(false)
		await initFavorites()
	}

	const onSelectAttribute = async (productId, selectedAttributes) => {
		const refreshProduct = await getProduct(productId, selectedAttributes)
		if (refreshProduct) {
			setProduct(refreshProduct)
		}
	}

	const resolveRedirectAndCartAndProduct = async productId => {
		const startParams = await Eitri.getInitializationInfos()
		if ((!startParams || !startParams.productId) && !productId) {
			return openPageError(true)
		}

		await startCart(startParams?.orderFormId).catch(e => console.error('Error startCart: ', e))

		try {
			const selectedAttributes = startParams?.selectedAttributes
				? JSON.parse(startParams.selectedAttributes)
				: null
			const product = await getProduct(productId || startParams.productId, selectedAttributes)
			if (product.productId) {
				resolveInitialVariation(product)
				setProduct(product)

				const _hasVariationEnabled = product.attributeSelections?.selections?.some(attr =>
					attr.values.some(v => v.available)
				)
				if (!_hasVariationEnabled) setHasVariationEnabled(_hasVariationEnabled)

				const images = product.images
				if (images && images.length > 0) {
					const imgUrl = formatImageUrl(product.images[0].url)
					await waitImageLoad(imgUrl)
				}
			} else {
				openPageError(true)
			}

			if (isPristine) {
				screenView(PAGE, 'PDP')
				viewItem(product)
				setIsPristine(false)
			}
		} catch (e) {
			console.error('Error getProduct: ', e)
			openPageError(true)
		}
	}

	const resolveInitialVariation = product => {
		let _selectedVariation = {}
		product.attributeSelections.selections.map(attr => {
			if (attr.values[0].available && /\bcor\b/.test(attr.displayType?.toLowerCase())) {
				const productColor = product.attributes.find(attrColor => attrColor.attributeId === attr.attributeId)
				_selectedVariation[attr.attributeId] = productColor.value
			} else if (attr.values && attr.values.length === 1) {
				_selectedVariation[attr.attributeId] = attr.values[0].value
			} else {
				_selectedVariation[attr.attributeId] = null
			}
		})

		setSelectedVariation(_selectedVariation)
	}

	const handleAddToCart = async () => {
		if (loadingBuyProduct) {
			return
		}

		setLoadingBuyProduct(true)
		try {
			const variantId = product?.attributeSelections?.selectedVariant?.productVariantId || product?.productVariantId
			await addItemToCart(parseInt(variantId), 1)
			setLoadingBuyProduct(false)
			setShowModalAddToCartConfirmation(true)
		} catch (e) {
			console.error('addItemToCart', e)
		}
		setLoadingBuyProduct(false)
	}

	const initFavorites = async () => {
		let isLoggedIn
		try {
			isLoggedIn = await Wake.customer.isLoggedIn()
		} catch (e) {
			console.error('initFavorites Error:', e)
		}

		if (isLoggedIn) {
			await startFavorites()
			return
		}

		// para o caso do login expirar enquanto estiver fora do app
		resetFavorites()
	}

	const requestStockAlert = async () => {
		setModalConfirmAlertStock(true)
	}

	return (
		<Page title={PAGE}>
			{isLoading ? (
				<LoadingComponent fullScreen />
			) : (
				<View>
					{product && (
						<View className='pb-4'>
							<Header product={product} />

							<ImagesCaroussel
								product={product}
								imagesHeight={pdpImagesHeight}
								orientation={orientation}
							/>

							<View className='p-4 flex flex-col gap-4'>
								<Description product={product} />

								<ProductAttributes
									product={product}
									attributes={product?.attributeSelections?.selections}
									selectedVariation={selectedVariation}
									setSelectedVariation={setSelectedVariation}
									refreshPage={refreshPage}
									onSelectAttribute={onSelectAttribute}
								/>

								<BuyActions
									loadingBuyProduct={loadingBuyProduct}
									product={product}
									handleAddToCart={handleAddToCart}
									requestStockAlert={requestStockAlert}
								/>
							</View>

							<ProductRecommendation product={product} />

							<Infos product={product} />
						</View>
					)}
					{!product && <Text>Nenhum produto encontrado</Text>}
				</View>
			)}

			<BottomInset />

			{showModalAddToCartConfirmation && (
				<ModalAddToCartConfirmation
					showModal={showModalAddToCartConfirmation}
					product={product}
					closeModal={() => setShowModalAddToCartConfirmation(false)}
				/>
			)}

			{modalConfirmAlertStock && (
				<ModalConfirmStockAlert
					showModal={modalConfirmAlertStock}
					product={product}
					closeModal={() => setModalConfirmAlertStock(false)}
				/>
			)}
		</Page>
	)
}
