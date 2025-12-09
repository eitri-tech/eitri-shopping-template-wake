import Eitri from 'eitri-bifrost'

export default function Contact(props) {
	const { className } = props

	const contactEmail = 'contato@contatos.com.br'

	const openEmail = () => {
		Eitri.deeplink.open({
			url: `mailto:${contactEmail}`
		})
	}

	const openPhone = () => {
		const message = `Oi! Vim do APP`

		const url = `https://api.whatsapp.com/send?phone=5522999149388&text=${encodeURIComponent(message)}`

		Eitri.openBrowser({ url })
	}

	return (
		<View className={`flex flex-col items-center mt-12 ${className || ''}`}>
			<Text className='text-center text-xs mb-3 font-medium text-neutral-900'>
				Precisa de ajuda? A gente resolve!
			</Text>

			<Text className='text-center text-[10px] mb-5 font-light text-neutral-900'>
				Fale com nosso time de customer experience
			</Text>

			<View className='flex gap-1 mb-5'>
				<View
					className='flex items-center justify-center border border-neutral-900 cursor-pointer min-w-[148px] py-2'
					onClick={openPhone}>
					<Text className='text-center text-[10px] underline font-light text-neutral-900'>
						(22) 99999-8888
					</Text>
				</View>

				<View
					className='border border-neutral-900 flex items-center justify-center cursor-pointer p-2 min-w-[148px]'
					onClick={openEmail}>
					<Text className='text-center text-xs underline font-light text-neutral-900'>
						${contactEmail}
					</Text>
				</View>
			</View>

			<View className='mb-7 flex flex-col items-center'>
				<Text className='text-center text-[10px] font-light text-neutral-900'>
					Atendimento de segunda a quinta-feira,
				</Text>

				<Text className='text-center text-[10px] font-light text-neutral-900'>
					das 07h às 17h, exceto feriados.
				</Text>

				<Text className='text-center text-[10px] font-light text-neutral-900'>Atendimento sexta-feira,</Text>

				<Text className='text-center text-[10px] font-light text-neutral-900'>
					das 07h às 16h, exceto feriados.
				</Text>
			</View>
		</View>
	)
}
