import { FaChevronDown } from 'react-icons/fa'

export default function InfoContent(props) {
	const { onClick, info, showInfo } = props

	return (
		<View className={'border-b border-b-black py-2'}>
			<View
				className='flex flex-row items-center justify-between'
				onClick={() => onClick(info?.type)}>
				<Text className={`font-bold uppercase`}>{info?.title}</Text>

				<View>
					<FaChevronDown
						className={`${showInfo ? 'rotate-180' : 'rotate-0'} transition-transform duration-300 ease-in-out`}
					/>
				</View>
			</View>
			{
				<View>
					<HTMLRender
						className={`w-full text transition-all duration-300 ease-in-out transform origin-top ${
							showInfo ? 'opacity-100 scale-y-100 mt-2' : 'opacity-0 scale-y-0 h-0 overflow-hidden'
						}`}
						html={info?.content}
					/>
				</View>
			}
		</View>
	)
}
