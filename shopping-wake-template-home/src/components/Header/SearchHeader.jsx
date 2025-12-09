import Eitri from 'eitri-bifrost'
import { View } from 'eitri-luminus'

import SearchInput from '../SearchInput/SearchInput'

export default function SearchHeader(props) {
	const { inputValue, onSubmit, onChange, onClickBack, iconBack } = props

	return (
		<View>
			<View className='flex justify-start items-center w-full'>
				<View
					className='p-3'
					onClick={onClickBack}>
					<Image
						src={iconBack}
						width={16}
						height={16}
					/>
				</View>
			</View>

			<SearchInput
				value={inputValue}
				onSubmit={onSubmit}
				onChange={onChange}
			/>
		</View>
	)
}
