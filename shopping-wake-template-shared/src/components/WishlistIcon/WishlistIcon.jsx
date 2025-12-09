export default function WishlistIcon(props) {
	const { checked } = props

	return checked ? (
		<svg
			id='wishlist-added-84880'
			className=''
			width='19'
			height='18'
			viewBox='0 0 19 18'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<path
				fill-rule='evenodd'
				clip-rule='evenodd'
				d='M0.371865 8.59832C-0.701135 5.24832 0.552865 1.41932 4.06987 0.286322C5.91987 -0.310678 7.96187 0.0413219 9.49987 1.19832C10.9549 0.0733218 13.0719 -0.306678 14.9199 0.286322C18.4369 1.41932 19.6989 5.24832 18.6269 8.59832C16.9569 13.9083 9.49987 17.9983 9.49987 17.9983C9.49987 17.9983 2.09787 13.9703 0.371865 8.59832Z'
				fill='black'></path>
		</svg>
	) : (
		<svg
			id='wishlist-empty-84880'
			width='21'
			height='20'
			viewBox='0 0 21 20'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			className=''>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M1.37187 9.59905C0.298865 6.24905 1.55287 2.42005 5.06987 1.28705C6.91987 0.690054 8.96187 1.04205 10.4999 2.19905C11.9549 1.07405 14.0719 0.694054 15.9199 1.28705C19.4369 2.42005 20.6989 6.24905 19.6269 9.59905C17.9569 14.9091 10.4999 18.9991 10.4999 18.9991C10.4999 18.9991 3.09787 14.9711 1.37187 9.59905Z'
				stroke='black'
				strokeWidth='0.8'
				strokeLinecap='round'
				strokeLinejoin='round'></path>
		</svg>
	)
}
