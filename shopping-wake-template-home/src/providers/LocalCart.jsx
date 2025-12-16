import { getCart, addItemToCart, removeCartItem, generateNewCart } from '../services/CartService'
import { verifyFlowByRegion } from '../services/PartnerService'

const LocalCart = createContext({})

export default function CartProvider({ children }) {
	const [cart, setCart] = useState(null)
	const [cartIsLoading, setCartInLoading] = useState(false)

	const executeCartOperation = async (operation, ...args) => {
		setCartInLoading(true)
		const newCart = await operation(...args)
		setCart(newCart)
		setCartInLoading(false)
		return newCart
	}

	const startCart = async cartId => {
		return executeCartOperation(getCart, cartId)
	}

	const addItem = async payload => {
		return executeCartOperation(addItemToCart, payload)
	}

	const removeItem = async itemId => {
		return executeCartOperation(removeCartItem, itemId)
	}

	const createNewCart = async () => {
		return executeCartOperation(generateNewCart)
	}

	const verifyRegion = async () => {
		try {
			await verifyFlowByRegion()
		} catch (e) {
			console.error('startConfigure', e)
		}
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
				createNewCart,
				verifyRegion
			}}>
			{children}
		</LocalCart.Provider>
	)
}

export function useLocalShoppingCart() {
	const context = useContext(LocalCart)

	return context
}
