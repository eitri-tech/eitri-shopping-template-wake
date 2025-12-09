import Eitri from 'eitri-bifrost'
import { Icon } from 'eitri-luminus'

export default function HeaderReturn(props) {
	const { backPage, onClick, iconColor, width } = props

	const onBack = () => {
		if (typeof onClick === 'function') {
			return onClick()
		} else {
			if (backPage) {
				Eitri.navigation.back(backPage)
			} else {
				Eitri.navigation.back()
			}
		}
	}

	return (
		<View
			onClick={() => onBack()}
			width={width || '40px'}
			height='40px'
			alignItems='center'
			justifyItems='start'>
			{/* <Icon
				iconKey='chevron-left'
				width={20}
				height={20}
				margin='none'
				color={iconColor || 'primary-100'}
			/> */}
		</View>
	)
}
