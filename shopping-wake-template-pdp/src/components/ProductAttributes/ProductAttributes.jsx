import Eitri from 'eitri-bifrost'
import { Chip } from 'shopping-wake-template-shared'

const ER_Color = new RegExp('\\b(cor)\\b')
export default function ProductAttributes(props) {
	const { product, attributes, selectedVariation, refreshPage, onSelectAttribute } = props

	// const colorAttributes = attributes.find(att => att?.name?.toLowerCase() === 'cor')
	const colorAttributes = null
	const sizeAttributes = attributes.find(att => att?.name?.toLowerCase() === 'tamanho')

	const handleAttributeSelection = (attr, value) => {
		const valueProductId = value?.alias?.split('-').pop()

		const actualVariations = product?.attributeSelections?.selections?.filter(
			s => s.attributeId !== attr.attributeId
		)

		const payload =
			actualVariations.map(actualVariation => {
				return {
					attributeId: actualVariation.attributeId,
					value:
						actualVariation?.values?.find(_val => _val.selected)?.value || actualVariation.values[0].value
				}
			}) ?? []

		payload.push({
			attributeId: attr.attributeId,
			value: value.value
		})

		onSelectAttribute(valueProductId, payload)
	}

	const getImageUrl = valueAttr => {
		return valueAttr?.printUrl?.replace(/-\d+\.jpg.*/, '-1.jpg')
	}

	return (
		<View className='flex flex-col w-full gap-4 snap-start'>
			{colorAttributes && (
				<View
					key={colorAttributes.attributeId}
					className='flex flex-row gap-4 w-full overflow-x-scroll'>
					{colorAttributes?.values?.map(valueAttr => {
						return (
							<View
								key={valueAttr.value}
								disabled={!valueAttr.available}
								className={`flex flex-col items-center gap-1`}
								onClick={() => handleAttributeSelection(colorAttributes, valueAttr)}>
								<View
									className={`w-[28px] h-[28px] flex items-center justify-center border ${valueAttr.available ? 'border-black' : 'border-neutral-300'} ${valueAttr.selected ? '!border-2 !border-black' : 'border'} rounded-md`}
									style={{ boxSizing: 'border-box' }}>
									<Image
										className={'w-[20px] h-[20px] rounded-md'}
										src={getImageUrl(valueAttr)}
									/>
								</View>
								{valueAttr.selected && (
									<View className={`h-[1px] w-full flex justify-center`}>
										<View className={`h-full w-[65%] bg-meteorite-01`} />
									</View>
								)}
							</View>
						)
					})}
				</View>
			)}

			{sizeAttributes && (
				<View
					key={sizeAttributes.attributeId}
					className='flex flex-row gap-4 w-full overflow-x-scroll'>
					{sizeAttributes.values.map(valueAttr => {
						return (
							<View
								key={valueAttr.value}
								className={`flex flex-col items-center gap-1`}
								onClick={() => handleAttributeSelection(sizeAttributes, valueAttr)}>
								<View
									className={`rounded border ${valueAttr.available ? 'border-black' : 'border-neutral-300'} ${valueAttr.selected ? '!border-2 !border-black' : ''}`}>
									<Text
										className={`text-xs px-3 py-1 ${valueAttr.available ? 'text-meteorite-01' : 'text-neutral-300'} ${valueAttr.selected ? 'font-bold' : ''}`}>
										{valueAttr.value}
									</Text>
								</View>
								{valueAttr.selected && (
									<View className={`h-[1px] w-full flex justify-center`}>
										<View className={`h-full w-[65%] bg-meteorite-01`} />
									</View>
								)}
							</View>
						)
					})}
				</View>
			)}
		</View>
	)
}
