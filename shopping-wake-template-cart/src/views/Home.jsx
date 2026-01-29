import Eitri from 'eitri-bifrost'

import { LoadingComponent, CustomButton, BottomInset } from 'shopping-wake-template-shared'

import { useLocalShoppingCart } from '../providers/LocalCart'
import { startConfigure } from '../services/AppService'

import { openCheckout } from '../services/NavigationService'
import { forceCartId } from '../services/CartService'
import { logViewCart, screenView } from '../services/TrackingService'
import { getWindowFilledHeight, waitForElement } from '../utils/Util'
import { openProduct } from '../services/NavigationService'
import CartItem from '../components/cartItem/CartItem'
import CartSummary from '../components/cartSummary/CartSummary'
import Header from '../components/Header/Header'
import EmptyCart from '../components/emptyCart/EmptyCart'
import Freight from '../components/freight/Freight'
import InputCoupon from '../components/inputCoupon/InputCoupon'
import InputSellerCode from '../components/inputSellerCode/InputSellerCode'

export default function Home() {
	const PAGE = 'Sacola'

	const { startCart, cart, addItem, removeItem } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(true)
	const [hasBackButton, setHasBackButton] = useState(true)

	const [summaryHeight, setSummaryHeight] = useState(null)
	const [isPristine, setIsPristine] = useState(true)

	useEffect(() => {
		window.scroll(0, 0)
		startHome()

		Eitri.navigation.setOnResumeListener(() => {
			screenView(PAGE, 'Cart')
			startCart().catch(e => {
				console.error('Error startCart: ', e)
				setIsLoading(false)
			})
		})
	}, [])

	useEffect(() => {
		if (cart) {
			setIsLoading(false)
			getHeight()

			if (isPristine) {
				logViewCart(cart)
				setIsPristine(false)
			}
		}
	}, [cart])

	const startHome = async () => {
		setIsLoading(true)
		await startConfigure()
		const startParams = await Eitri.getInitializationInfos()

		// Se tem tabIndex na inicialização, não foi aberto pela bottom navigation
		if (startParams?.tabIndex) {
			setHasBackButton(false)
		} else if (isPristine) {
			screenView(PAGE, 'Cart')
		}

		await resolveCart(startParams)
	}

	const getHeight = async () => {
		try {
			await waitForElement(`#cart-summary`)
			const filledHeight = await getWindowFilledHeight('header-container-internal', 'cart-summary')
			// const headerHeight = await getWindowFilledHeight('header-container-internal')
			// const usefulArea = `calc(100vh - ${(filledHeight + headerHeight)}px)`
			const usefulArea = `calc(100vh - ${filledHeight}px)`

			setSummaryHeight(usefulArea)
		} catch (e) {
			setSummaryHeight(null)
			console.error('getHeight Error', e)
		}
	}

	const resolveCart = async startParams => {
		if (startParams?.cartId) {
			await forceCartId(startParams?.cartId)
		}

		await startCart().catch(e => console.error('Error startCart: ', e))
	}

	const goToCheckout = async () => {
		openCheckout()
	}

	const handleAddCartItem = async (productVariantId, quantity) => {
		return await addItem(productVariantId, quantity)
	}

	const handleRemoveCartItem = async (p, q) => {
		await removeItem(p, q)
	}

	const refreshCart = async () => {
		startHome()
	}

	const goToProduct = productId => {
		openProduct(productId)
	}

	return (
		<Page title={PAGE}>
			<Header cart={cart} />

			{isLoading && (
				<View>
					<LoadingComponent fullScreen />
				</View>
			)}

			{cart?.products?.length > 0 ? (
				<>
					{/* Lista de produtos */}
					<View className='pt-4'>
						{cart?.products?.map((item, index) => (
							<CartItem
								key={`item_${index}`}
								item={item}
								handleRemoveCartItem={handleRemoveCartItem}
								handleAddCartItem={handleAddCartItem}
								goToProduct={goToProduct}
							/>
						))}
					</View>

					<Freight />

					<InputCoupon />

					<InputSellerCode />

					{/* Resumo do carrinho */}
					<CartSummary
						items={cart?.products.map(i => ({
							productVariantId: i.productVariantId,
							quantity: i.quantity
						}))}
						itemsValue={cart.subtotal}
						shipping={cart.shippingFee}
						discount={cart.discount}
						totalValue={cart.total}
						couponDiscount={cart.couponDiscount}
						appliedCoupon={cart.coupon}
						goToCheckout={goToCheckout}
						refreshCart={refreshCart}
					/>
				</>
			) : (
				<>{!isLoading && <EmptyCart />}</>
			)}

			<BottomInset />
		</Page>
	)
}
