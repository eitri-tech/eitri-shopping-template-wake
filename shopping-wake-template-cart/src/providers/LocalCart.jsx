import { addCartItem, removeCartItem, getCheckout, getCart } from '../services/CartService'

const LocalCart = createContext({})

export default function CartProvider({ children }) {
	const [cart, setCart] = useState(null)
	const [cartIsLoading, setCartIsLoading] = useState(false)

	const executeCartOperation = async (operation, ...args) => {
		setCartIsLoading(true)
		const newCart = await operation(...args)
		setCart(newCart)
		setCartIsLoading(false)
		return newCart
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

	return (
		<LocalCart.Provider
			value={{
				setCart,
				startCart,
				cart,
				cartIsLoading,
				addItem,
				removeItem
			}}>
			{children}
		</LocalCart.Provider>
	)
}

export function useLocalShoppingCart() {
	const context = useContext(LocalCart)

	return context
}
