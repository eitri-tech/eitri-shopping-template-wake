export default function TextContent(props) {
	const { data, seo, ...params } = props

	return (
		<View
			direction='column'
			gap={8}
			paddingHorizontal='small'
			marginTop={params?.marginTop || 'small'}
			marginBottom={params?.marginBottom || 'small'}>
			{data &&
				data.map((content, idx) => (
					<HTMLRender
						htmlString={content.content}
						key={`c_${content.contentId}_${idx}`}
						preFormatted={true}
					/>
				))}
		</View>
	)
}
