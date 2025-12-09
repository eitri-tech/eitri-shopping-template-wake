import { CustomButton } from 'shopping-wake-template-shared'
import Eitri from 'eitri-bifrost'
import FavoriteButton from '../FavoriteButton/FavoriteButton'

const getBuyActionsState = product => {
	const unSelectedAttribute = product?.attributeSelections?.selections?.find(sel => !sel.values.some(v => v.selected))

	if (unSelectedAttribute) {
		return {
			status: 'MISSING_SELECTION',
			label: `Selecione ${
				unSelectedAttribute?.name?.toLowerCase() === 'cor' ? 'a' : 'o'
			} ${unSelectedAttribute?.name}`
		}
	}

	const isSelectionAvailable = product?.attributeSelections?.selections?.every(sel =>
		sel.values.some(v => v.selected && v.available)
	)

	if (isSelectionAvailable) {
		return {
			status: 'AVAILABLE',
			label: 'Comprar'
		}
	}

	return {
		status: 'UNAVAILABLE',
		label: 'Item indisponível'
	}
}

export default function BuyActions(props) {
	const { product, handleAddToCart, loadingBuyProduct } = props

	const state = getBuyActionsState(product)

	return (
		<View className='flex gap-2'>
			<CustomButton
				isLoading={loadingBuyProduct}
				disabled={state.status !== 'AVAILABLE'}
				label={state.label}
				onClick={handleAddToCart}
			/>
			<FavoriteButton
				className={'bg-gray-200 flex items-center justify-center w-[50px]'}
				productId={product.productId}
				productVariantId={product?.productVariantId}
				productName={product?.productName}
				productPrice={product?.prices?.price}
				disableAbsolutePosition={true}
			/>
		</View>
	)
}
