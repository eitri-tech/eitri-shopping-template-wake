import SliderProductList from '../banner/SliderProductList'

export default function ProductShelf(props) {
	const { data, ...content } = props

	return (
		<SliderProductList
			data={data}
			{...content}
		/>
	)
}
