import { Wake } from 'eitri-shopping-wake-shared'
import searchIcon from '../../assets/images/search.svg'
import arrowBackIcon from '../../assets/images/arrow_left_search.svg'
import { View } from 'eitri-luminus'
import { CustomInput } from 'shopping-wake-template-shared'

let timeoutId

export default function SearchInput(props) {
	const { onSubmit } = props

	const [term, setTerm] = useState('')

	useEffect(() => {
		const inputElement = document.getElementById('search-input')
		if (inputElement) {
			inputElement.focus()
		}
	}, [])

	const cleanInput = () => {
		setTerm('')
	}

	const buttonRight = (
		<View
			onClick={onSubmit}
			className='zindex-10 p-1'>
			<Image
				src={searchIcon}
				width={16}
				height={16}
			/>
		</View>
	)

	return (
		<View className='relative px-3 flex flex-row items-center justify-center w-full'>
			<View className='flex items-center justify-between w-full border-b bg-[#efefef] rounded-full px-4'>
				<CustomInput
					id={'search-input'}
					placeholder='O que você procura?'
					className={'!border-none'}
					onChange={e => setTerm(e.target.value)}
					onSubmit={() => onSubmit(term)}
					value={term}
					insideRight={buttonRight}
				/>
			</View>
		</View>
	)
}
