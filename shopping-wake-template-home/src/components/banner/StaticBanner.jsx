import Eitri from 'eitri-bifrost'

export default function StaticBanner(props) {
	const {
		keyProduct,
		src,
		width,
		height,
		mainText,
		mainTextSize,
		secondaryText,
		secondaryTextSize,
		subText,
		subTextSize,
		onPress
	} = props

	return (
		<View
			key={`StaticBanner${keyProduct}`}
			onClick={onPress}
			className='snap-start relative'>
			<View
				style={{
					width: width ? width : '100vw',
					height: height ? height : '100vh',
					backgroundImage: `url(${src})`
				}}
				className='flex justify-center items-center bg-no-repeat bg-cover bg-center'>
				<View
					className='flex flex-col justify-center items-center h-full mt-20'
					style={{ gap: 25 }}>
					{/* Criar um prop de cor para os textos */}
					{mainText && (
						<Text
							textAlign='center'
							fontWeight='bold'
							fontSize={mainTextSize ? mainTextSize : 'large'}>
							{mainText}
						</Text>
					)}
					{secondaryText && (
						<Text
							textAlign='center'
							fontWeight='bold'
							fontSize={secondaryTextSize ? secondaryTextSize : 'medium'}>
							{secondaryText}
						</Text>
					)}
					{subText && (
						<Text
							textAlign='center'
							fontWeight='bold'
							fontSize={subTextSize ? subTextSize : 'extra-small'}>
							{`${subText} >`}
						</Text>
					)}
				</View>
			</View>
		</View>
	)
}
