import Eitri from 'eitri-bifrost'
import { CustomButton, Spacing, Divisor, Loading } from 'shopping-wake-template-shared'
import { formatCurrency } from '../../utils/Util'
import InputCep from '../inputCep/InputCep'
import { addCouponToCart, getShipping, removeCouponFromCart } from '../../services/CartService'
import { View } from 'eitri-luminus'
import InputCoupon from '../inputCoupon/InputCoupon'
import { useLocalShoppingCart } from '../../providers/LocalCart'

export default function CartSummary(props) {
	const { items, itemsValue, discounts, totalValue, goToCheckout, couponDiscount, appliedCoupon, refreshCart } = props

	const { startCart, cart, addItem, removeItem } = useLocalShoppingCart()

	const [collapsed, setCollapsed] = useState(false)
	const [loadingShipping, setLoadingShipping] = useState(false)
	const [shippingOptions, setShippingOptions] = useState(null)
	const [shippingError, setShippingError] = useState(null)

	const [loadingCoupon, setLoadingCoupon] = useState(false)
	const [couponError, setCouponError] = useState('')

	const searchShipping = async cep => {
		if (cep.length < 8) {
			setShippingError('Cep inválido')
			return
		}

		setLoadingShipping(true)
		setShippingOptions(null)
		setShippingError('')
		try {
			const response = await getShipping(cep, items)
			if (response.length > 0) {
				setShippingOptions(response)
			} else {
				setShippingError('Não foram encontrados resultados para o cep')
			}
		} catch (e) {
			console.error('searchShipping:', e)
		}
		setLoadingShipping(false)
	}

	const addCoupon = async coupon => {
		setLoadingCoupon(true)
		setCouponError('')

		try {
			const response = await addCouponToCart(coupon)
			if (response.coupon) {
				refreshCart()
			} else {
				setCouponError('O cupom não pôde ser aplicado')
			}
		} catch (e) {
			console.error('addCoupon:', coupon, e)
			setCouponError('Cupom inválido ou expirado')
		}
		setLoadingCoupon(false)
	}

	const removeCoupon = async coupon => {
		try {
			await removeCouponFromCart(coupon)
			refreshCart()
		} catch (e) {
			console.error('removeCoupon:', coupon, e)
		}
	}

	return (
		<View className='mx-4 mb-4 bg-white border border-neutral-200 rounded-lg shadow-sm'>
			{/* Resumo dos valores */}
			<View className='p-4 border-b border-neutral-100'>
				<Text className='text-base font-semibold mb-3 text-gray-800 block mb-1'>Resumo do pedido</Text>

				{itemsValue > 0 && (
					<View className='flex justify-between mt-1'>
						<Text className='flex justify-start w-[45%] text-sm font-medium'>SUBTOTAL</Text>
						<View className={'flex justify-center w-[10%]'}>|</View>
						<Text className='flex justify-end w-[45%] text-sm font-medium'>
							{formatCurrency(itemsValue)}
						</Text>
					</View>
				)}

				{discounts > 0 && (
					<View className='flex justify-between mt-1'>
						<Text className='flex justify-start w-[45%] text-sm font-medium'>DESCONTO</Text>
						<View className={'flex justify-center w-[10%]'}>|</View>
						<Text className='flex justify-end w-[45%] text-sm font-medium'>
							{formatCurrency(discounts)}
						</Text>
					</View>
				)}

				{totalValue > 0 && (
					<View className='flex justify-between mt-1'>
						<Text className='flex justify-start w-[45%] text-sm font-medium'>VALOR TOTAL</Text>
						<View className={'flex justify-center w-[10%]'}>|</View>
						<Text className='flex justify-end w-[45%] text-sm font-medium'>
							{formatCurrency(totalValue)}
						</Text>
					</View>
				)}
			</View>

			{/* Botões de ação */}
			<View className='p-4'>
				<View className='grid grid-cols-1 gap-3'>
					<CustomButton
						label='Finalizar pedido'
						onClick={goToCheckout}
					/>
					<View
						className={'flex justify-center mt-2'}
						onClick={() => Eitri.navigation.close()}>
						<Text className={'underline text-xs'}>CONTINUAR COMPRANDO</Text>
					</View>
				</View>
			</View>
		</View>
	)
}
