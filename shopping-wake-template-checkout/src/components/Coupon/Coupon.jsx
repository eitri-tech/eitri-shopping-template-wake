import { useCheckout } from '../../providers/UseCheckout'
import InputCoupon from './components/InputCoupon'

export default function Coupon(props) {
	const { addCoupon, removeCoupon, getCouponInfo } = useCheckout()
	const [loadingCoupon, setLoadingCoupon] = useState(false)
	const [couponError, setCouponError] = useState('')

	const { coupon, couponDiscount } = getCouponInfo()

	const handleAddCoupon = async coupon => {
		setCouponError('')
		setLoadingCoupon(true)
		try {
			const response = await addCoupon(coupon)
			if (response.coupon) {
				return
			} else {
				setCouponError('Cupom inválido ou expirado')
			}
		} catch (e) {
			console.error('addCoupon:', coupon, e)
			setCouponError('Falha ao aplicar cupom')
		} finally {
			setLoadingCoupon(false)
		}
	}

	const handleRemoveCoupon = async coupon => {
		setLoadingCoupon(true)

		try {
			removeCoupon(coupon)
		} catch (error) {
			console.error('handleRemoveCoupon:', error)
		}

		setLoadingCoupon(false)
	}

	return (
		<View className='px-4'>
			<InputCoupon
				addAction={handleAddCoupon}
				removeAction={handleRemoveCoupon}
				appliedCoupon={coupon}
				couponDiscount={0}
				loading={loadingCoupon}
				msgError={couponError}
			/>
		</View>
	)
}
