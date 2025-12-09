import Eitri from 'eitri-bifrost'
import { Spacing, Loading } from 'shopping-wake-template-shared'

export default function Coupon(props) {
	const { cart, addCoupon, removeCoupon } = props

	const [coupon, setCoupon] = useState('')
	const [appliedCoupon, setAppliedCoupon] = useState('')
	const [invalidCoupon, setInvalidCoupon] = useState(false)
	const [couponTextAlert, setCouponTextAlert] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (cart?.marketingData?.coupon) {
			setInvalidCoupon(false)
			setAppliedCoupon(cart.marketingData.coupon)

			if (coupon === cart?.marketingData?.coupon) {
				setCouponTextAlert(`Cupom aplicado!`)
			}
		} else {
			const errorMessage = cart?.messages || []
			const couponError = coupon && errorMessage.find(message => message.text.includes(coupon))

			if (couponError) {
				if (couponError.code === 'couponNotFound') {
					setCouponTextAlert('Cupom inválido')
				} else if (couponError.code === 'couponExpired') {
					setCouponTextAlert('Cupom Expirado')
				}
				setInvalidCoupon(true)
			} else {
				setInvalidCoupon(false)
				setAppliedCoupon('')
			}
		}
	}, [cart])

	const inputOnChange = value => {
		setCoupon(value)
	}

	const onPressAddCoupon = () => {
		setIsLoading(true)
		addCoupon(coupon)
		setIsLoading(false)
	}

	const onPressRemoveCoupon = () => {
		setCoupon('')
		setCouponTextAlert('')
		removeCoupon()
	}

	return (
		<View>
			<View
				paddingTop='medium'
				paddingHorizontal='medium'>
				<Text
					fontSize='medium'
					fontWeight='bold'>
					Cupom de desconto
				</Text>
				<View
					display='flex'
					justifyContent='between'
					alignItems='center'>
					{appliedCoupon ? (
						<>
							<View
								display='flex'
								marginVertical='small'
								paddingVertical='medium'
								paddingHorizontal='small'
								borderWidth='hairline'
								borderColor='neutral-300'
								borderRadius='medium'
								width='90%'>
								<Text>{appliedCoupon}</Text>
							</View>
							<View onPress={onPressRemoveCoupon}>
								<View paddingHorizontal='medium'>
									<Image
										iconKey='trash-2'
										color={'tertiary-500'}
										width={30}
									/>
								</View>
							</View>
						</>
					) : (
						<>
							<View
								display='flex'
								marginVertical='small'
								paddingVertical='nano'
								borderWidth='hairline'
								borderColor='neutral-300'
								borderRadius='circular'
								width='60vw'>
								<TextInput
									placeholder='Insira o código'
									value={coupon}
									borderColor='accent-100'
									color='accent-100'
									onChange={value => inputOnChange(value)}
									borderHidden={true}
								/>
							</View>
							<View onPress={onPressAddCoupon}>
								<View
									display='flex'
									height='50px'
									width='30vw'
									backgroundColor={'accent-100'}
									borderWidth='hairline'
									borderColor='secondary-300'
									justifyContent='center'
									alignItems='center'
									borderRadius='circular'>
									{isLoading ? (
										<Loading
											width='30px'
											color='secondary-300'
										/>
									) : (
										<Text
											fontWeight='bold'
											color={isLoading ? 'accent-100' : 'secondary-300'}>
											Adicionar
										</Text>
									)}
								</View>
							</View>
						</>
					)}
				</View>
				{couponTextAlert && (
					<View paddingHorizontal='medium'>
						<Text color={invalidCoupon ? 'tertiary-500' : 'secondary-700'}>{couponTextAlert}</Text>
					</View>
				)}
				<Spacing />
			</View>
		</View>
	)
}
