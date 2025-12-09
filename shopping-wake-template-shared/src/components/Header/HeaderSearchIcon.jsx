import { View } from 'eitri-luminus'

export default function HeaderSearchIcon(props) {
	const { onClick, className } = props

	return (
		<View onClick={onClick}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 24 24'
				width='24'
				height='24'
				fill='none'
				stroke='currentColor'
				strokeLinecap='round'
				strokeLinejoin='round'
				className={className || 'text-header-content'}>
				<path d='M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z' />
			</svg>
		</View>
	)
}
