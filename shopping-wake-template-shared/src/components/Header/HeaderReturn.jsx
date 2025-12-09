import Eitri from 'eitri-bifrost'

export default function HeaderReturn(props) {
	const { backPage, onClick, className } = props

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
			className={`flex items-center ${className}`}
			onClick={onBack}>
			<svg
				width='20'
				height='14'
				viewBox='0 0 20 14'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				<path
					d='M7 -6.11959e-07L-6.11959e-07 7L7 14L7.68627 13.3137L1.85294 7.48039L19.8333 7.48039L19.8333 6.51961L1.85294 6.51961L7.68627 0.686274L7 -6.11959e-07Z'
					fill='#433D3F'
				/>
			</svg>

			{/*<svg*/}
			{/*	xmlns='http://www.w3.org/2000/svg'*/}
			{/*	width='24'*/}
			{/*	height='24'*/}
			{/*	viewBox='0 0 24 24'*/}
			{/*	fill='none'*/}
			{/*	stroke='currentColor'*/}
			{/*	strokeWidth='2'*/}
			{/*	strokeLinecap='round'*/}
			{/*	strokeLinejoin='round'*/}
			{/*	className='text-header-content'>*/}
			{/*	<polyline points='15 18 9 12 15 6'></polyline>*/}
			{/*</svg>*/}
		</View>
	)
}
