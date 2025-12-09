export default function Tabs(props) {
	const { tabs } = props

	const [activeTab, setActiveTab] = useState(0)

	const handleTabChange = tabId => {
		setActiveTab(tabId)
	}

	return (
		<View>
			<View
				display='flex'
				gap={28}>
				{tabs?.map((tab, index) => (
					<View
						key={index}
						padding='10px'
						borderBottomWidth={activeTab === index ? 'thin' : 'none'}
						onClick={() => handleTabChange(index)}>
						<Text>{tab.title}</Text>
					</View>
				))}
			</View>

			<View
				padding='nano'
				border='hairline'>
				{tabs.map(
					(tab, index) =>
						activeTab === index && (
							<View key={index}>
								<Text>{tab.value}</Text>
							</View>
						)
				)}
			</View>
		</View>
	)
}
