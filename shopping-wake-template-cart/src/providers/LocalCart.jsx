import { addCartItem, removeCartItem, getCheckout, getCart, addCheckoutMetadata, removeCheckoutMetadata, addCouponToCart, removeCouponFromCart } from '../services/CartService'

const LocalCart = createContext({})

export default function CartProvider({ children }) {
	const [cart, setCart] = useState(null)
	const [cartIsLoading, setCartIsLoading] = useState(false)

	const executeCartOperation = async (operation, ...args) => {
		setCartIsLoading(true)
		const newCart = await operation(...args)
		if (newCart) {
			setCart(newCart)
			setCartIsLoading(false)
			return newCart
		}

		setCartIsLoading(false)
		return cart
	}

	const startCart = async cartId => {
		await executeCartOperation(getCart, cartId)
		return executeCartOperation(getCheckout, cartId)
	}

	const addItem = async (productVariantId, quantity) => {
		return executeCartOperation(addCartItem, productVariantId, quantity)
	}

	const removeItem = async (productVariantId, quantity) => {
		return executeCartOperation(removeCartItem, productVariantId, quantity)
	}

	const addCoupon = async (coupon) => {
		return executeCartOperation(addCouponToCart, coupon)
	}

	const removeCoupon = async (coupon) => {
		return executeCartOperation(removeCouponFromCart, coupon)
	}

	const addMetadata = async (metadata) => {
		return executeCartOperation(addCheckoutMetadata, cart.checkoutId, metadata)
	}
	
	const removeMetadata = async keys => {
		return executeCartOperation(removeCheckoutMetadata, keys)
	}

	return (
		<LocalCart.Provider
			value={{
				setCart,
				startCart,
				cart,
				cartIsLoading,
				addItem,
				removeItem,
				addCoupon,
				removeCoupon,
				addMetadata,
				removeMetadata,
			}}>
			{children}
		</LocalCart.Provider>
	)
}

export function useLocalShoppingCart() {
	const context = useContext(LocalCart)

	return context
}
