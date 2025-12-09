import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, CustomInput, HeaderSearchIcon } from 'shopping-wake-template-shared'
import { View } from 'eitri-luminus'

export default function MainHeader() {
	const [term, setTerm] = useState('')

	const handleOnKeyPress = e => {
		if (e.key === 'Enter') {
			Eitri.navigation.navigate({
				path: 'Search',
				state: {
					searchTerm: term
				}
			})
		}
	}

	return (
		<HeaderContentWrapper scrollEffect={true}>
			<View>TESTE</View>
			{/* <View className='relative w-full'>
				<CustomInput
					placeholder='O que você procura em nossa loja?'
					className='h-[40px] w-full !pr-[40px] focus:outline-none'
					onChange={e => setTerm(e.target.value)}
					onKeyPress={handleOnKeyPress}
				/>
				<HeaderSearchIcon className='absolute top-[7px] right-[7px] w-[26px] h-[26px] text-neutral-400' />
			</View> */}
		</HeaderContentWrapper>
	)
}
