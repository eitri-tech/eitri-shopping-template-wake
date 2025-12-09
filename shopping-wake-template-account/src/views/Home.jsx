import Eitri from 'eitri-bifrost'
import { CustomButton, LoadingComponent } from 'shopping-wake-template-shared'
import { Toggle } from 'eitri-luminus'
import { startConfigure } from '../services/AppService'
import { doLogout, getSimpleCustomerData, isLoggedIn } from '../services/CustomerService'
import { navigate, PAGES } from '../services/NavigationService'
import { logScreenView } from '../services/TrackingService'
import Header from '../components/Header/Header'
import ProfileCardButton from '../components/ProfileCardButton/ProfileCardButton'
import arrowAccountRed from '../assets/icons/arrow_account_red.svg'
import iconCart from '../assets/icons/cart-shopping-solid-full.svg'
import iconUser from '../assets/icons/circle-user-solid-full.svg'
import iconMail from '../assets/icons/envelope-solid-full.svg'
import iconKey from '../assets/icons/key-solid-full.svg'
import iconLocation from '../assets/icons/location-arrow-solid-full.svg'
import iconMoney from '../assets/icons/money-bill-1-wave-solid-full.svg'
import iconExit from '../assets/icons/right-from-bracket-solid-full.svg'
import iconContactUs from '../assets/icons/comments-solid-full.svg'
import iconFavorite from '../assets/icons/heart-solid-full.svg'
import iconPrivacity from '../assets/icons/lock-solid-full.svg'
import iconChange from '../assets/icons/right-left-solid-full.svg'
import iconShipping from '../assets/icons/truck-solid-full.svg'
import iconSales from '../assets/icons/sales-solid-full.svg'
import iconInterrogation from '../assets/icons/interrogation-solid-full.svg'

export default function Home(props) {
	const PAGE = 'Minha conta'
	const [isLoading, setIsLoading] = useState(true)
	const [userData, setUserData] = useState({})

	const [isLogged, setIsLogged] = useState(false)
	const [showBackButton, setShowBackButton] = useState(true)

	// const [permissionGeo, setPermissionGeo] = useState(false)
	const [notification, setNotification] = useState(false)

	useEffect(() => {
		window.scroll(0, 0)

		init()

		Eitri.navigation.setOnResumeListener(() => {
			notificationStatus()
		})
	}, [])

	const init = async () => {
		await startConfigure()
		const initialInfos = await Eitri.getInitializationInfos()
		setShowBackButton(!initialInfos?.tabIndex)

		if (initialInfos?.action?.toLowerCase() === 'requestlogin') {
			navigate(PAGES.LOGIN, { closeAppAfterLogin: true }, true)
			return
		}

		if (initialInfos?.action?.toLowerCase() === 'orderlist') {
			navigate(PAGES.MY_ORDERS, {}, true)
			return
		}

		const isLogged = await isLoggedIn().catch(e => {
			console.error('isLoggedIn Error', e)
			return false
		})

		setIsLogged(isLogged)

		if (initialInfos?.action?.toLowerCase() === 'favorites') {
			navigate(PAGES.WISH_LIST, {}, true)
			return
		}

		const customerData = await getSimpleCustomerData().catch(e => {
			console.error('getSimpleCustomerData Error', e)
			return {}
		})

		setUserData(customerData)
		setIsLoading(false)

		logScreenView(PAGE)
		checkPermissions()

		resumeListener()
	}

	const resumeListener = async () => {
		Eitri.navigation.setOnResumeListener(async () => {
			if (!isLogged) {
				const _isLogged = await isLoggedIn().catch(e => {
					console.error('isLoggedIn Error', e)
					return false
				})
				if (_isLogged) {
					init()
				}
			}
			checkPermissions()
		})
	}

	const generateGreetings = customerData => {
		if (customerData?.customerName) {
			return `Olá, ${customerData.customerName?.replace(/\b\w/g, c => c.toUpperCase())}`
		}
		if (customerData?.companyName) {
			return customerData.companyName
		}
		return 'Olá'
	}

	const _doLogout = async () => {
		setIsLoading(true)
		await doLogout()
		setIsLogged(false)
		setIsLoading(false)
	}

	const checkPermissions = async () => {
		notificationStatus()
	}

	async function notificationStatus() {
		const permission = await Eitri.notification.checkPermission()

		if (permission?.status === 'BLOCKED' || permission?.status === 'DENIED') {
			setNotification(false)
		} else {
			setNotification(true)
		}
	}

	async function handlePermissionConfig() {
		try {
			await Eitri.system.openAppSettings().then(() => {
				notificationStatus()
			})
		} catch (error) {
			console.error('Erro ao abrir configurações:', error)
		}
	}

	const handleBuyWhatsAPP = () => {
		const message = `Oi! Vim do APP`
		const url = `https://api.whatsapp.com/send?phone=5522999149388&text=${encodeURIComponent(message)}`

		Eitri.openBrowser({ url })
	}

	const handleGoTrocas = () => {
		const url = `https://www.loja.com.br/central-devolucoes`

		Eitri.openBrowser({ url })
	}

	return (
		<Page title={PAGE}>
			<Header showBackButton={showBackButton} />

			<LoadingComponent
				fullScreen
				isLoading={isLoading}
			/>

			<View className={`flex-grow justify-between p-4 ${isLoading ? 'hidden' : 'flex flex-col'} `}>
				<View className='flex flex-col gap-6'>
					{isLogged && (
						<View className='flex flex-col'>
							<Text
								className='font-bold'
								marginBottom='quark'
								fontSize='small'>
								{generateGreetings(userData)}
							</Text>

							{userData?.email && <Text>{userData.email}</Text>}
						</View>
					)}

					{isLogged ? (
						<>
							<View className='flex flex-col gap-2'>
								<Text className='font-medium uppercase'>Minhas Compras</Text>

								<ProfileCardButton
									icon={iconCart}
									label='Meus Pedidos'
									onClick={() => navigate(PAGES.MY_ORDERS)}
								/>

								{/* <ProfileCardButton
									icon={iconMoney}
									label='Meus Créditos'
									onClick={() => console.log('Implementar tela de meus creditos')}
								/> */}

								<ProfileCardButton
									icon={iconFavorite}
									label='Favoritos'
									onClick={() => navigate(PAGES.WISH_LIST)}
								/>
							</View>

							<View className='flex flex-col gap-2'>
								<Text className='font-medium uppercase'>Cadastro</Text>

								{/* <ProfileCardButton
									icon={iconMail}
									label='Alterar E-mail'
									onClick={() => navigate(PAGES.EDIT_PROFILE)}
								/> */}

								{/* <ProfileCardButton
									icon={iconKey}
									label='Alterar senha'
									onClick={() => navigate(PAGES.EDIT_PROFILE)}
								/> */}

								<ProfileCardButton
									icon={iconUser}
									label='Meus Dados'
									onClick={() => navigate(PAGES.EDIT_PROFILE)}
								/>

								<ProfileCardButton
									icon={iconUser}
									label='Meus Endereços'
									onClick={() => navigate(PAGES.ADDRESSES)}
								/>
							</View>
						</>
					) : (
						<View className='flex flex-col gap-1 border border-black rounded p-4'>
							<Text className='text-base font-medium'>Aproveite o máximo do app!</Text>

							<Text className='text-primary-300'>Para uma melhor experiência, entre ou cadastre-se:</Text>

							<CustomButton
								label='Entrar ou criar conta'
								className='bg-primary text-primary-content mt-3 h-8 w-full text-sm font-normal rounded'
								onClick={() => navigate(PAGES.LOGIN, { redirectTo: 'account' })}
							/>
						</View>
					)}

					<View className='flex flex-col gap-2'>
						<Text className='font-medium uppercase'>Ajuda</Text>

						<ProfileCardButton
							icon={iconShipping}
							label='Política de Entrega'
							onClick={() => navigate(PAGES.DELIVERY_POLICY)}
						/>
						<ProfileCardButton
							icon={iconChange}
							label='Política de Devolução'
							onClick={() => navigate(PAGES.EXCHANGES_RETURNS)}
						/>
						<ProfileCardButton
							icon={iconSales}
							label='Política de Venda'
							onClick={() => navigate(PAGES.EXCHANGES_RETURNS)}
						/>
						<ProfileCardButton
							icon={iconPrivacity}
							label='Política de Privacidade'
							onClick={() => navigate(PAGES.PRIVACY_POLICY)}
						/>
					</View>

					<View className='flex flex-col gap-2'>
						<Text className='font-medium uppercase'>Institucional</Text>
						<ProfileCardButton
							icon={iconMoney}
							label='Sobre a loja'
							onClick={() => navigate(PAGES.ABOUT_US)}
						/>
						<ProfileCardButton
							icon={iconContactUs}
							label='Atendimento'
							onClick={() => navigate(PAGES.CONTACT)}
						/>
						<ProfileCardButton
							icon={iconInterrogation}
							label='Perguntas Frequentes'
							onClick={() => navigate(PAGES.FREQUENTLY_ASKED_QUESTIONS)}
						/>
					</View>

					<View className='flex flex-col gap-2'>
						<Text className='font-medium uppercase'>Permissões</Text>

						<ProfileCardButton
							icon={iconPrivacity}
							label='Notificação'
							labelClassName='flex w-full flex-row justify-between items-center'>
							<View
								onClick={handlePermissionConfig}
								minWidth={'45px'}
								className={`border border-black rounded-full p-1 flex flex-row justify-between items-center ${
									notification ? 'bg-gray-100' : 'bg-red-200'
								}`}>
								{notification && <Text className='text-xs font-light '>On</Text>}

								<View className={`block w-[10px] h-[10px] rounded-full bg-black`} />

								{!notification && <Text className='text-xs font-light pr-1'>Off</Text>}
							</View>
						</ProfileCardButton>
					</View>

					{isLogged && (
						<ProfileCardButton
							icon={iconExit}
							label='Sair'
							labelClassName='uppercase'
							onClick={_doLogout}
						/>
					)}
				</View>
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
