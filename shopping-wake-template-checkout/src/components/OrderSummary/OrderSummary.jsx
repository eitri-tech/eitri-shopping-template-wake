import Eitri from 'eitri-bifrost'
import { useCheckout } from '../../providers/UseCheckout'
import { View } from 'eitri-luminus'

export default function OrderSummary(props) {
	const { ...rest } = props
	const { getTotalizers, loading, checkout, customer } = useCheckout()

	const [localTotalizers, setLocalTotalizers] = useState([])
	const [showAllItems, setShowAllItems] = useState(false)
	const [showDiscount, setShowDiscount] = useState(false)

	const count = useRef(5)

	useEffect(() => {
		getTotalizers().then(_totalizers => {
			setLocalTotalizers(_totalizers)
		})
	}, [checkout])

	useEffect(() => {
		if (customer) {
			try {
				// identificar se é colaborador
				const isPartner = customer?.partners?.some(partner => partner?.name?.toLowerCase() === 'colaboradores')

				// se for colaborador, não alterar state
				if (isPartner) return
			} catch (e) {
				console.error('Error isPartner', e)
			}
			setShowDiscount(true)
		}
	}, [customer])

	const copyCheckoutId = () => {
		if (count.current > 0) {
			count.current -= 1
			return
		}
		Eitri.clipboard.setText({
			text: checkout?.checkoutId
		})
		count.current = 5
	}

	const products = useMemo(() => {
		if (!localTotalizers && !localTotalizers?.items.length) return []

		return showAllItems ? localTotalizers.items : localTotalizers.items?.slice(0, 3)
	}, [localTotalizers, showAllItems])

	const toggleShowAllItems = () => setShowAllItems(prev => !prev)

	return (
		<>
			{loading ? (
				<View className='flex w-screen justify-center'>{/*<Loading />*/}</View>
			) : (
				<View {...rest}>
					<View onClick={copyCheckoutId}>
						<Text className='text-base font-medium'>Resumo do pedido</Text>
					</View>

					<View className='flex flex-col mt-1 gap-2'>
						{products?.map(totalizer => (
							<View
								key={totalizer.label}
								className='flex flex-row justify-between gap-2'>
								<View width={'20%'}>
									<Image
										src={totalizer.image && totalizer.image.replace(/\?.*/, '')}
										className='w-full bg-top bg-no-repeat bg-cover bg-fixed shadow-sm object-cover min-h-[100px]'
									/>
								</View>

								<View
									width={'80%'}
									className='flex flex-ror justify-between'>
									<View className='flex flex-wrap'>
										<Text className='text-sm'>{totalizer.label}</Text>
									</View>

									<Text className='text-sm'>{totalizer.value}</Text>
								</View>
							</View>
						))}

						{localTotalizers?.items && localTotalizers?.items.length > 3 && (
							<View
								className='flex items-center justify-center p-2 mt-3'
								onClick={toggleShowAllItems}>
								<Text className='underline text-xs font-medium'>
									{showAllItems ? 'Ver Menos' : 'Ver todos os itens'}
								</Text>
							</View>
						)}
					</View>

					<View className='flex justify-between mt-8'>
						<Text className='font-medium text-sm'>Subtotal</Text>
						<Text className='font-medium text-sm'>{localTotalizers.subtotal}</Text>
					</View>

					{showDiscount && localTotalizers.totalDiscount && (
						<View className='flex justify-between mt-4'>
							<Text className='font-medium text-sm'>Desconto</Text>
							<Text className='font-medium text-sm'>{localTotalizers.totalDiscount}</Text>
						</View>
					)}

					{localTotalizers.shippingFee && (
						<View className='flex justify-between mt-4'>
							<Text className='font-medium text-sm '>Frete</Text>
							<Text className='font-medium text-sm'>{localTotalizers.shippingFee}</Text>
						</View>
					)}

					{localTotalizers.paymentFees && (
						<View className='flex justify-between mt-4'>
							<Text className='font-medium text-sm'>Taxa</Text>
							<Text className='font-medium text-sm'>{localTotalizers.paymentFees}</Text>
						</View>
					)}

					{localTotalizers.checkingAccountValue && (
						<View className='flex justify-between mt-4'>
							<Text className='font-medium text-sm '>Valor conta corrente</Text>
							<Text className='font-medium text-sm'>{localTotalizers.checkingAccountValue}</Text>
						</View>
					)}

					<View className='flex justify-between mt-4'>
						<Text className='font-semibold text-sm'>Total do pedido</Text>
						<Text className='font-semibold text-sm'>{localTotalizers.total}</Text>
					</View>
				</View>
			)}
		</>
	)
}
