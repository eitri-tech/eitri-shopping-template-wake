export default function BasicText(props) {
	const { data, params } = props

	return (
		<View
			width='100%'
			display='flex'
			direction='column'
			alignItems={params?.alignItems || 'center'}
			justifyContent={params?.justifyContent || 'center'}
			backgroundColor={params?.backgroundColor || 'background-color'}
			paddingTop={params?.paddingTop || 'small'}
			paddingBottom={params?.paddingBottom || 'small'}
			paddingRight={params?.paddingRight || 'small'}
			paddingLeft={params?.paddingRight || 'small'}>
			{params?.title?.content && (
				<Text
					fontWeight='bold'
					fontSize='big'
					color={params?.title.color || 'neutral-900'}
					paddingTop={params?.title.paddingTop || 'small'}
					paddingBottom={params?.title.paddingBottom || 'small'}
					paddingRight={params?.title.paddingRight || 'small'}
					paddingLeft={params?.title.paddingRight || 'small'}>
					{params?.title.content}
				</Text>
			)}
			<Text
				color={params?.color || 'neutral-900'}
				textAlign={params?.textAlign || 'center'}
				fontSize='extra-large'>
				{data.content}
			</Text>
		</View>
	)
}
