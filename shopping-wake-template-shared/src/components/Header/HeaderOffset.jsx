export default function HeaderOffset(props) {
	const { topInset } = props

	return (
		<>
			{topInset && <View topInset={'auto'} />}
			<View className={`h-[60px]`} />
		</>
	)
}
