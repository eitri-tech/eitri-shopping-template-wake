import { formatCurrency } from '../../utils/Util'
import FavoriteButton from '../FavoriteButton/FavoriteButton'
import { View, Text } from 'eitri-luminus'

export default function Description(props) {
	const { product } = props

	// console.log('Description props:', props)

	const getPrice = () => {
		const minimumPrice = product?.buyBox?.minimumPrice || 0
		const maximumPrice = product?.buyBox?.maximumPrice || 0
		const buyBoxPrice = minimumPrice > 0 ? minimumPrice : maximumPrice > 0 ? maximumPrice : 0
		if (buyBoxPrice) {
			return `${formatCurrency(buyBoxPrice)}`
		} else if (product?.prices?.installmentPlans.length > 0) {
			const pixPlan = product?.prices?.installmentPlans?.find(item => item.displayName === 'Pix')
			const boletoPlan = product?.prices?.installmentPlans?.find(item => item.displayName === 'Boleto')
			const bestPrice =
				pixPlan?.installments?.[0]?.totalValue || boletoPlan?.installments?.[0]?.totalValue || null

			const price = bestPrice && bestPrice < product?.prices?.price ? bestPrice : product?.prices?.price
			return `${formatCurrency(price)}`
		}

		return `${formatCurrency(product?.prices?.price)}`
	}

	return (
		<View>
			<View className='flex items-center justify-between'>
				<Text className={'text-base font-bold uppercase'}>{product.productName}</Text>
			</View>
			<View>
				<View className='mt-2'>
					{product?.prices?.listPrice > product?.prices?.price && (
						<Text className='line-through text-xs'>{formatCurrency(product?.prices?.listPrice)}</Text>
					)}
					<View>
						<Text className='font-bold text-lg'>{getPrice()}</Text>
						<Text className=''> com 10 de desconto no boleto/pix</Text>
					</View>
					{product?.prices?.bestInstallment && (
						<View>
							<Text className=''>ou </Text>
							<Text className='font-bold'>
								{formatCurrency(product?.prices?.bestInstallment?.totalValue)}
							</Text>
							<Text className=''>{` em ${product?.prices?.bestInstallment?.number}x de `}</Text>
							<Text className='font-bold'>{formatCurrency(product?.prices?.bestInstallment?.value)}</Text>
							<Text className=''>{!product?.prices?.bestInstallment?.fees ? ' sem juros' : ''}</Text>
						</View>
					)}
				</View>
			</View>
		</View>
	)
}
