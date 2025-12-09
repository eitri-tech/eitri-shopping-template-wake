import Eitri from 'eitri-bifrost'

export default function PaymentData(props) {
	const { payment } = props
	const [colorButtonCopy, setColorButtonCopy] = useState('#FFFDF4')

	const copyQrCode = async qrCode => {
		await Eitri.clipboard.setText({
			text: qrCode
		})

		setColorButtonCopy('#7cb724')

		setTimeout(() => {
			setColorButtonCopy('#FFFDF4')
		}, 3000)
	}

	return (
		<View>
			<Text>Dados para pagamento:</Text>

			<View className='border-b mt-6 border-neutral-300 px-3 py-0.5 overflow-x-auto'>
				<Text className='text-primary-500 whitespace-nowrap'>{payment.pix?.qrCode}</Text>
			</View>

			<View className='flex justify-center mt-6'>
				<Image
					src={payment.pix?.qrCodeUrl}
					width='120px'
					height='120px'
				/>
			</View>

			<View
				className='flex gap-1 w-full justify-center items-center p-1 bg-primary-100 mt-2'
				onClick={() => copyQrCode(payment.pix?.qrCode)}>
				<Text className={`text-xs ${colorButtonCopy === '#FFFDF4' ? 'text-accent-300' : 'text-positive-700	'}`}>
					Copiar código
				</Text>

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
	)
}
