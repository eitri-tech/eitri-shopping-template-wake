import { useCheckout } from '../../providers/UseCheckout'
import dollarBill from '../../assets/images/dollar-bill.svg'
import { formatCurrency } from '../../utils/Util'

export default function CheckingAccountCard(props) {
	const { checkout, addCheckingAccount, removeCheckingAccount } = useCheckout()
	const [checkingAccountActive, setCheckingAccountActive] = useState(false)
	const [checkingAccountBalance, setCheckingAccountBalance] = useState(null)

	useEffect(() => {
		if (checkout?.customer?.checkingAccountBalance > 0) {
			setCheckingAccountBalance(checkout.customer.checkingAccountBalance)
		}
	}, [])

	const toggleCheckingAccount = checked => {
		setCheckingAccountActive(checked)

		if (checked) {
			addCheckingAcc()
		} else {
			removeCheckingAcc()
		}
	}

	const addCheckingAcc = async () => {
		setCheckingAccountActive(true)
		await addCheckingAccount()
	}

	const removeCheckingAcc = async () => {
		setCheckingAccountActive(false)
		await removeCheckingAccount()
	}

	return (
		<>
			{checkingAccountBalance > 0 && (
				<View className='px-4'>
					<Text className='mb-3 text-sm font-medium uppercase'>Conta Corrente</Text>

					<View className='flex flex-col items-start justify-start rounded-lg border border-gray-200 p-4'>
						<View className='flex w-full flex-col items-start justify-start gap-3'>
							<View className='flex flex-row items-center justify-center gap-3'>
								<Image
									src={dollarBill}
									className='h-6 w-6'
								/>

								<Text className='text-sm font-bold'>Sua conta corrente</Text>
							</View>

							<Text className='text-xs'>
								Você tem <Text className='font-semibold'>{formatCurrency(checkingAccountBalance)}</Text>{' '}
								disponíveis em sua conta corrente. Gostaria de utilizá-lo nesta compra?
							</Text>

							<View className='flex items-center gap-2'>
								<Checkbox
									id='frm_checkingAccount'
									name='checkingAccount'
									value={true}
									checked={checkingAccountActive}
									onChange={e => toggleCheckingAccount(e?.target?.checked)}
								/>

								<Text className='font-semibold text-xs'>Sim, quero utilizar minha conta corrente</Text>
							</View>
						</View>
					</View>
				</View>
			)}
		</>
	)
}
