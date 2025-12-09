export default function OrderTimeline(props) {
	const { order, ...rest } = props

	// tirando os status
	const filteredStatusHistory = order?.statusHistory.filter(
		(value, index, self) => index === self.findIndex(t => t.status === value.status)
	)

	const timeline = filteredStatusHistory?.map((statusHistory, index) => {
		return {
			status: statusHistory.status,
			date: new Date(statusHistory.changeDate).toLocaleString('pt-BR'),
			// a wake sempre acrescentao ao history quando acontece algo, entao o ultimo item sempre é o atual
			current: false
		}
	})

	return (
		<View
			elevation='low'
			padding='large'
			{...rest}>
			{timeline?.map((item, index) => (
				<View
					key={index}
					position='relative'
					borderLeftWidth={timeline.length - 1 === index ? '' : 'thick'}
					borderColor='primary-900'
					paddingBottom={timeline.length - 1 === index ? '' : 'large'}
					paddingLeft='large'>
					<View
						position='absolute'
						left={timeline.length - 1 === index ? '-6px' : '-8px'}
						width='14px'
						height='14px'
						borderRadius='circular'
						borderColor={item.current ? 'primary-900' : ''}
						borderWidth={item.current ? 'thick' : ''}
						backgroundColor={item.current ? 'accent-100' : 'primary-900'}
					/>
					<View
						position='relative'
						top='-3px'>
						<Text
							block
							fontSize='extra-small'>
							{item.status}
						</Text>
						<Text
							marginTop='quark'
							block
							fontSize='quark'>
							{item.date}
						</Text>
					</View>
				</View>
			))}
		</View>
	)
}
