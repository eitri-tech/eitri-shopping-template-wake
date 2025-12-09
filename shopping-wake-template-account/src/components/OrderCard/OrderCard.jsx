import Eitri from 'eitri-bifrost'
import { navigate, PAGES } from '../../services/NavigationService'
import { formatDateDaysMonthYear } from '../../utils/Util'

export default function OrderCard(props) {
	const { order } = props
	const [colorButtonCopy, setColorButtonCopy] = useState('#54555b')

	const prepareData = order => {
		const formattedDate = formatDateDaysMonthYear(order.date)

		const total = order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

		const items = `${order.products.length} ${order.products.length > 1 ? 'itens' : 'item'}`

		let borderColor = ''
		let textColor = ''

		switch (order.status.status) {
			case 'Pedido Cancelado':
				borderColor = 'border-negative-700'
				textColor = 'text-negative-700'
				break
			case 'Aguardando Pagamento':
				borderColor = 'border-warning-700'
				textColor = 'text-warning-700'
				break
			default:
				borderColor = 'border-primary-100'
				textColor = 'text-primary-100'
				break
		}

		return {
			orderId: order.orderId,
			status: order.status.status,
			borderColor,
			textColor,
			date: formattedDate,
			total,
			items,
			image: order?.products[0]?.image,
			products: `${order?.products[0]?.name}${order.products.length > 1 ? ' e outros' : ''}`
		}
	}

	const preparedData = prepareData(order)

	const goToOrderDetail = () => {
		navigate(PAGES.ORDER_DETAIL, { order })
	}

	const copyOrderNumber = async orderNumber => {
		await Eitri.clipboard.setText({
			text: String(orderNumber)
		})

		setColorButtonCopy('#7cb724')

		setTimeout(() => {
			setColorButtonCopy('#54555b')
		}, 3000)
	}

	return (
		<View>
			<View className='flex flex-col gap-4'>
				<View className='flex flex-col gap-1'>
					<Text>Data do Pedido</Text>

					<Text className='text-xs'>{preparedData.date}</Text>
				</View>

				<View className='flex items-center justify-between'>
					<View className='flex gap-1 items-center'>
						<View className='flex flex-col gap-1'>
							<Text>Número do Pedido</Text>

							<Text className='text-xs'>{preparedData.orderId}</Text>
						</View>

						<View onClick={() => copyOrderNumber(preparedData.orderId)}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								class='icon icon-tabler icon-tabler-clipboard'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								stroke-width='2'
								stroke={colorButtonCopy}
								fill='none'
								stroke-linecap='round'
								stroke-linejoin='round'>
								<path
									stroke='none'
									d='M0 0h24v24H0z'
									fill='none'></path>
								<path d='M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2'></path>
								<path d='M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z'></path>
							</svg>
						</View>
					</View>

					<View className='flex flex-col gap-1'>
						<Text className='text-right'>Total</Text>

						<Text className='text-xs'>{preparedData.total}</Text>
					</View>
				</View>

				<View className='flex items-center justify-between'>
					<Text>{preparedData.items}</Text>

					<View className={`flex items-center p-2 border ${preparedData.borderColor}`}>
						<Text className={`text-xs ${preparedData.textColor}`}>{preparedData.status}</Text>
					</View>
				</View>

				<View className='mt-3 flex gap-[6px] items-center'>
					<View className='w-12 h-12'>
						<Image
							src={preparedData.image}
							className='max-w-full max-h-full'
						/>
					</View>

					<Text className='text-sm'>{preparedData.products}</Text>
				</View>

				<Button
					className='!min-h-9 !h-9 !text-accent-300 text-xs !font-normal !rounded-none'
					onClick={goToOrderDetail}>
					Ver detalhes do pedido
				</Button>
			</View>
		</View>
	)
}
