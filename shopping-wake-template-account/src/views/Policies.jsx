import { HeaderContentWrapper, HeaderText, HeaderReturn, Loading, Tracking } from 'shopping-wake-template-shared'

export default function Policies() {
	const PAGE = 'Políticas'
	const [currentTabId, setCurrentTabId] = useState('payment')
	const [sections, setSections] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	const tabs = [
		{ id: 'payment', label: 'Pagamento' },
		{ id: 'shipping', label: 'Entrega' },
		{ id: 'privacy', label: 'Privacidade' },
		{ id: 'promotional', label: 'Promocionais' }
	]

	useEffect(() => {
		loadContent()
	}, [])

	useEffect(() => {
		const labelTab = tabs.find(tab => tab.id === currentTabId)?.label
		Tracking.screenView(`Politicas_${labelTab}`, 'account.policies')
	}, [currentTabId])

	const loadContent = async () => {
		// setIsLoading(true)
		// try {
		// 	const result = await getCmsContent('landingPage', 'politicas')
		// 	setSections(result?.sections || [])
		// } finally {
		// 	setIsLoading(false)
		// }
	}

	const getPolicyContent = () => {
		const titleMap = {
			payment: 'paymentPolicy',
			shipping: 'shippingPolicy',
			privacy: 'privacyPolicy',
			promotional: 'promotionPolicy'
		}

		const targetTitle = titleMap[currentTabId]
		const targetSection = sections.find(section => section.data.title === targetTitle)

		const raw = targetSection?.data?.content
		if (!raw) return ''

		try {
			const parsed = JSON.parse(raw)
			return parsed.blocks?.[0]?.text || ''
		} catch (e) {
			Tracking.error(e, 'account.getPolicyContent', { targetTitle, targetSection })
			return ''
		}
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper
				className='flex items-center justify-between bg-accent-300 py-2'
				scrollEffect={false}>
				<HeaderReturn />

				<HeaderText text={PAGE} />

				<View width={20} />
			</HeaderContentWrapper>

			<TabSelector
				tabs={tabs}
				currentTabId={currentTabId}
				onTabChange={setCurrentTabId}
			/>

			<View className='flex-grow bg-neutral-100 p-4'>
				{isLoading ? (
					<View className='flex h-full w-full items-center justify-center'>
						<Loading />
					</View>
				) : (
					<View />
					// <HtmlRenderer
					// 	preFormatted
					// 	className='h-full w-full'
					// 	htmlString={getPolicyContent()}
					// />
				)}
			</View>
		</Page>
	)
}
