import { CustomButton, CustomInput, LoadingComponent } from 'shopping-wake-template-shared'
import { View, Text, TextInput, Button, Image } from 'eitri-luminus'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { formatCurrency } from '../../utils/Util'

export default function InputCoupon(props) {

	const { cart, addCoupon, removeCoupon } = useLocalShoppingCart()
	
	const [coupon, setCoupon] = useState('')
	const [appliedCoupon, setAppliedCoupon] = useState('')
	const [couponDiscount, setCouponDiscount] = useState(0)
	const [loading, setLoading] = useState(false)
	const [msgError, setMsgError] = useState('')

	useEffect(() => {
		setAppliedCoupon(cart?.coupon || '')
		setMsgError('')
	}, [cart])

	const applyCoupon = async () => {
		const formatedCoupon = coupon.trim()
		setLoading(true)
		try {
			if (formatedCoupon) {
				await addCoupon(formatedCoupon)
			}
		} catch (e) {
			setMsgError('Ocorreu uma falha ao aplicar o cupom.')
		}
		setLoading(false)
	}

	const removeApplyCoupon = async () => {
		setLoading(true)
		try {
			await removeCoupon(coupon)
		} catch (e) {
			setMsgError('houve uma falha ao remover o cupom.')
		}
		setLoading(false)
	}

	return (
		<View className='mx-4 mb-4 p-4 bg-white border border-neutral-200 rounded'>
			<Text className='font-semibold text-base-content text-lg mb-2'>
				{`Cupom ${appliedCoupon ? 'aplicado' : ''}`}
			</Text>

			<View className='flex flex-row gap-2 items-center'>
				<View className={'w-2/3'}>
					{!!appliedCoupon ? (
						<View className='flex items-center justify-between border border-neutral-200 rounded px-2 py-3'>
							<Text className='font-semibold text-base-content'>
								{appliedCoupon}
							</Text>
						</View>
					) : (
						<CustomInput
							className={'bg-neutral border-sm'}
							placeholder='Insira seu cupom'
							value={coupon}
							onChange={e => setCoupon(e.target.value)}
						/>
					)}
				</View>
				<View className={'w-1/3'}>
					{!!appliedCoupon ? (
						<CustomButton
							label={'Remover'}
							className='!bg-gray-200 !text-black'
							onClick={removeApplyCoupon}
						/>
					) : (
						<CustomButton
							label={'Aplicar'}
							onClick={applyCoupon}
						/>
					)}
				</View>
			</View>
			
			{loading && (
				<View className='flex flex-row w-full items-center justify-start pt-2'>
					<Loading className='loading-xs text-gray-400' />
					<Text className='ml-4 text-sm text-gray-500'>Tratando cupom</Text>
				</View>
			)}

			{msgError && (
				<View className='flex flex-row w-full items-center justify-start pt-2 px-2'>
					<Text className='text-red-600 text-sm'>{msgError}</Text>
				</View>
			)}
		</View>
	)
}
