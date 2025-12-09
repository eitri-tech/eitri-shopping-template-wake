import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderReturn } from 'shopping-wake-template-shared'
import iconMail from '../assets/icons/envelope-solid-full.svg'
import iconWhatsapp from '../assets/icons/whatsapp-full.svg'
import iconPhone from '../assets/icons/phone-solid-full.svg'
import ProfileCardButton from '../components/ProfileCardButton/ProfileCardButton'

export default function Contact(props) {
	const PAGE = 'Fale conosco'

	const [messageVisible, setMessageVisible] = useState(false)

	const copyForMemory = async message => {
		try {
			await Eitri.clipboard.setText({
				text: String(message)
			})
			setMessageVisible(true)
			setTimeout(() => {
				setMessageVisible(false)
			}, 5000)
		} catch (e) {
			console.error('copyOrderNumber', e)
		}
	}

	const sendEmail = async email => {
		try {
			await Eitri.deeplink.open({
				url: `mailto:${email}`
			})
		} catch (e) {
			console.error('sendEmail', e)
			copyForMemory(email)
		}
	}

	const sendWhatsApp = async () => {
		const phoneNumber = '22999149388'
		try {
			const message = `Oi! Vim do APP`
			const url = `https://api.whatsapp.com/send?phone=55${phoneNumber}&text=${encodeURIComponent(message)}`

			Eitri.openBrowser({ url, inApp: true })
		} catch (e) {
			console.error('sendWhatsApp', e)
			copyForMemory(phoneNumber)
		}
	}

	const handlePhoneClick = async phone => {
		const formattedPhone = `${phone.replace(/\D/g, '')}`
		try {
			await Eitri.deeplink.open({
				url: `tel://${formattedPhone}`
			})
		} catch (e) {
			console.error('handlePhoneClick', e)
			copyForMemory(formattedPhone)
		}
	}

	const backToPage = () => {
		Eitri.navigation.back()
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<View className='flex flex-row justify-start items-center gap-4'>
					<HeaderReturn onClick={backToPage} />
					<Text className=''>{PAGE}</Text>
				</View>
			</HeaderContentWrapper>

			<View className='flex flex-col p-4 gap-4'>
				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>Central de Atendimento</Text>
					<Text className='text-sm leading-relaxed text-justify'>
						Tá precisando de ajuda? Clique nos botões abaixo e entre em contato conosco pelo nosso canal de
						atendimento oficial de sua preferência
					</Text>
				</View>
				<View className='flex flex-col gap-2'>
					<ProfileCardButton
						icon={iconMail}
						label='E-mail SAC: contato@email.com.br'
						onClick={() => sendEmail('contato@email.com.br')}
					/>

					<ProfileCardButton
						icon={iconWhatsapp}
						label='WhatsApp: (22) 99914-9388'
						onClick={sendWhatsApp}
					/>

					<ProfileCardButton
						icon={iconMail}
						label='Devoluções: logisticareversa@email.com.br'
						onClick={() => sendEmail('logisticareversa@email.com.br')}
					/>

					<ProfileCardButton
						icon={iconPhone}
						label='Telefone: (21) 9999-8888'
						onClick={() => handlePhoneClick('(21) 3333-4444')}
					/>
				</View>
			</View>

			<View className='flex flex-col p-4 gap-4'>
				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>Horário de atendimento SAC:</Text>
					<Text className='text-sm leading-relaxed text-justify'>SEX: 7:00 às 16H</Text>
					<Text className='text-sm leading-relaxed text-justify'>SEX: 7:00 às 16H</Text>
				</View>

				<View className='flex flex-col gap-2'>
					<Text className='text-lg font-bold uppercase'>Horário de atendimento Devoluções:</Text>
					<Text className='text-sm leading-relaxed text-justify'>SEG - QUI: 7h às 17h</Text>
					<Text className='text-sm leading-relaxed text-justify'>SEX: 7h às 16h</Text>
					<View onClick={() => sendEmail('logisticareversa@email.com.br')}>
						<Text className='text-sm leading-relaxed text-justify underline'>
							logisticareversa@email.com.br
						</Text>
					</View>
				</View>
			</View>

			<View
				className={`
				fixed bottom-22 left-0 right-0 justify-center items-center
				bg-green-500 text-white rounded-lg shadow-lg 
				px-4 py-2 text-sm font-medium mx-4
				transition-all duration-500 ease-in-out
				${messageVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
			`}>
				<Text className='text-xm'>Copiado para área de transferência</Text>
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
