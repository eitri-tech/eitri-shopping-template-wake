export default function ContentTitle(props) {
	const { className, ...rest } = props

	return (
		<Text
			className={`font-bold text-2xl ${className}`}
			{...rest}>
			{props.children}
		</Text>
	)
}
