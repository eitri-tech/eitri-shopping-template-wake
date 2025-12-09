export default function TabSelector(props) {
	const { tabs, currentTabId, onTabChange } = props

	return (
		<View direction='row'>
			{tabs?.map(tab => (
				<View
					key={tab.id}
					grow={1}
					height='48px'
					width={`calc(100% / ${tabs.length})`}
					display='flex'
					alignItems='center'
					justifyContent='center'
					backgroundColor={tab.id === currentTabId ? 'neutral-100' : 'accent-100'}
					onClick={() => onTabChange(tab.id)}>
					<Text
						fontWeight='bold'
						color={tab.id === currentTabId ? 'primary-100' : 'neutral-900'}>
						{tab.label}
					</Text>
				</View>
			))}
		</View>
	)
}
