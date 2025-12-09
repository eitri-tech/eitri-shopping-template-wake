import Eitri from 'eitri-bifrost'

export const PAGES = {
	EDIT_ADDRESS: '/AddressForm',
	NEW_ADDRESS: '/AddressForm',
	HOME: '/Home',
	MY_ORDERS: '/MyOrders',
	PERSONAL_DATA: '/PersonalData',
	ORDER_DETAIL: '/OrderDetail',
	PRIVACY_POLICY: '/PrivacyPolicy',
	DELIVERY_POLICY: '/DeliveryPolicy',
	SALES_POLICY: '/SalesPolicy',
	ABOUT_US: '/AboutUs',
	CONTACT: '/Contact',
	FREQUENTLY_ASKED_QUESTIONS: '/FrequentlyAskedQuestions',
	WORK_WITH_US: '/WorkWithUs',
	STORES: '/Stores',
	PAYMENT_METHODS: '/PaymentMethods',
	DELIVERY: '/Delivery',
	EXCHANGES_RETURNS: '/ExchangesReturns',
	SPLASHSCREEN: '/SplashScreen/ScreenFirst',
	SPLASHSCREENSECOND: '/SplashScreen/ScreenSecond',
	SPLASHSCREENTHIRD: '/SplashScreen/ScreenThird',
	PASSWORD_RESET: '/PasswordReset',
	LOGIN: '/Login',
	REGISTER: '/Register',
	EDIT_PROFILE: '/EditProfile',
	WISH_LIST: '/WishList',
	WHO_WE_ARE: '/WhoWeAre',
	POLICIES: '/Policies',
	ADDRESSES: '/Addresses',
	MYCASHBACK: '/MyCashback'
}

export const PAGE_LABEL = {
	ADDRESS: 'Endereços',
	EDIT_ADDRESS: 'Editar Endereços',
	HOME: 'Home',
	LOGIN: 'Login',
	SIGNIN: 'SignIn',
	REGISTER: 'Novo Cadastro',
	PASSWORD_RESET: 'Redefinir Senha',
	MY_ORDERS: 'Meus Pedidos',
	PERSONAL_DATA: 'Dados Pessoais',
	EDIT_PERSONAL_DATA: 'Editar Dados Pessoais',
	ORDER_DETAIL: 'Detalhes do Pedido',
	WISH_LIST: 'Favoritos',
	STORES: 'Nossas Lojas',
	WORK_WITH_US: 'Trabalhe Conosco',
	PRIVACY_POLICY: 'Política de Privacidade',
	ABOUT_US: 'Sobre Nós',
	CONTACT: 'Contato'
}

export const openProduct = async (productId, currentPage) => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'pdp',
			initParams: { productId }
		})
	} catch (e) {
		console.error('navigate to pdp: Error trying to open product', e)
	}
}

export const navigate = (path, state = {}, replace = false) => {
	return Eitri.navigation.navigate({ path, state, replace })
}

export const openBrowser = (currentPage, url, inApp) => {
	Eitri.openBrowser({
		url,
		inApp
	})
}
