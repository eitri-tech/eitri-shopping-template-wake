export default function BottomInset(props) {
	const { offSet } = props

	return (
		<>
			<View
				bottomInset={'auto'}
				className={'w-full'}
			/>
			{offSet && (
				<View
					height={offSet}
					className={'w-full'}
				/>
			)}
		</>
	)
}
