import HeaderTemplate from '../components/Shared/HeaderTemplate/HeaderTemplate'
import { View, Text, Dropdown } from 'eitri-luminus'

export default function Stores() {
	const PAGE = 'Nossas Lojas'
	const [selectedState, setSelectedState] = useState('')
	const [selectedCity, setSelectedCity] = useState('')

	const ownStores = []

	const franchiseStores = []

	const allStores = [...ownStores, ...franchiseStores]

	const states = useMemo(() => {
		return [...new Set(allStores.map(store => store.state))]
	}, [allStores])

	const cities = useMemo(() => {
		let filteredStores = allStores
		if (selectedState) {
			filteredStores = allStores.filter(store => store.state === selectedState)
		}
		return [...new Set(filteredStores.map(store => store.city))]
	}, [allStores, selectedState])

	const filteredStores = useMemo(() => {
		let result = allStores

		if (selectedState) {
			result = result.filter(store => store.state === selectedState)
		}

		if (selectedCity) {
			result = result.filter(store => store.city === selectedCity)
		}

		return {
			own: result.filter(store => ownStores.some(o => o.name === store.name)),
			franchise: result.filter(store => franchiseStores.some(f => f.name === store.name))
		}
	}, [allStores, selectedState, selectedCity])

	const handleStateChange = value => {
		setSelectedState(value)
		setSelectedCity('')
	}

	const handleCityChange = value => {
		setSelectedCity(value)
	}

	const renderStoreCard = store => (
		<View
			key={store.name}
			backgroundColor='white'
			borderRadius='medium'
			padding='large'
			direction='column'
			gap={12}
			width='100%'
			elevation='low'
			maxWidth={400}>
			<View
				direction='row'
				alignItems='center'
				gap={12}>
				{/* <Icon
					iconKey='map-pin'
					color='primary-500'
					width={24}
					height={24}
				/> */}
				<Text
					fontSize='large'
					fontWeight='bold'
					color='primary-900'>
					{store.name}
				</Text>
			</View>

			<View
				direction='column'
				gap={8}
				paddingLeft={36}>
				<Text color='neutral-500'>{store.address}</Text>
				<Text color='neutral-500'>{`${store.neighborhood} - ${store.city} - ${store.state}`}</Text>

				<View
					direction='row'
					gap={8}
					alignItems='center'
					marginTop={4}>
					{/* <Icon
						iconKey='phone'
						color='primary-500'
						width={16}
						height={16}
					/> */}
					<Text color='neutral-500'>{store.phone}</Text>
				</View>

				{store.whatsapp && (
					<View
						direction='row'
						gap={8}
						alignItems='center'>
						{/* <Icon
							iconKey='message-circle'
							color='success-500'
							width={16}
							height={16}
						/> */}
						<Text color='neutral-500'>{store.whatsapp}</Text>
					</View>
				)}
			</View>
		</View>
	)

	return (
		<Page title={PAGE}>
			<HeaderTemplate
				headerType={'ReturnAndText'}
				contentText={'Nossas Lojas'}
			/>

			<View
				padding='large'
				direction='column'
				gap={32}
				width='100%'>
				<View
					direction='row'
					gap={16}
					marginBottom={16}>
					<View flex={1}>
						<Dropdown
							placeholder='ESTADO'
							onChange={handleStateChange}
							value={selectedState}
							width='34vw'>
							{states.map(state => (
								<Dropdown.Item
									key={state}
									value={state}
									label={state}
								/>
							))}
						</Dropdown>
					</View>
					<View
						flex={1}
						width='100%'>
						<Dropdown
							placeholder='CIDADE'
							width='100%'
							onChange={handleCityChange}
							value={selectedCity}>
							{cities.map(city => (
								<Dropdown.Item
									key={city}
									value={city}
									label={city}
								/>
							))}
						</Dropdown>
					</View>
				</View>

				{filteredStores.own.length > 0 && (
					<View
						direction='column'
						gap={8}>
						<Text
							fontSize='xlarge'
							fontWeight='bold'
							color='primary-900'>
							LOJAS PRÓPRIAS
						</Text>
						<View
							height={4}
							width={60}
							backgroundColor='primary-500'
							marginBottom={16}
						/>

						<View
							direction='row'
							gap={16}
							flexWrap='wrap'
							justifyContent='flex-start'>
							{filteredStores.own.map(store => renderStoreCard(store))}
						</View>
					</View>
				)}

				{filteredStores.franchise.length > 0 && (
					<View
						direction='column'
						gap={8}>
						<Text
							fontSize='xlarge'
							fontWeight='bold'
							color='primary-900'>
							LOJAS FRANQUEADAS
						</Text>
						<View
							height={4}
							width={60}
							backgroundColor='primary-500'
							marginBottom={16}
						/>

						<View
							direction='row'
							gap={16}
							flexWrap='wrap'
							justifyContent='flex-start'>
							{filteredStores.franchise.map(store => renderStoreCard(store))}
						</View>
					</View>
				)}

				{filteredStores.own.length === 0 && filteredStores.franchise.length === 0 && (
					<View
						direction='column'
						alignItems='center'
						justifyContent='center'
						padding='immense'
						gap={16}>
						{/* <Icon
							iconKey='alert-circle'
							color='neutral-500'
							width={48}
							height={48}
						/> */}
						<Text
							fontSize='large'
							color='neutral-500'
							textAlign='center'>
							Nenhuma loja encontrada com os filtros selecionados
						</Text>
					</View>
				)}
			</View>
		</Page>
	)
}
