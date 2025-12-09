import Eitri from 'eitri-bifrost'
import { View, Text, Radio, Loading } from 'eitri-luminus'
import { CustomButton, CustomInput } from 'shopping-wake-template-shared'
import { useState } from 'react'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { getShippingQuotes } from '../../services/CartService'
import { formatCurrency, formatDeliveryMessage } from '../../utils/Util'

export default function Freight(props) {
	const { startCart, cart, addItem, removeItem } = useLocalShoppingCart()

	const [cep, setCep] = useState('')
	const [loading, setLoading] = useState(false)
	const [freightOptions, setFreightOptions] = useState([])
	const [selectedFrete, setSelectedFrete] = useState(null)

	const calcularFrete = async () => {
		setLoading(true)
		console.log('cep', cep)
		const result = await getShippingQuotes(cep)
		setFreightOptions(result)

		setLoading(false)
	}

	return (
		<View className='mx-4 mb-4 p-4 bg-white border border-neutral-200 rounded'>
			<Text
				className='font-semibold text-base-content'
				render='h3'>
				Calcular Frete
			</Text>

			<View className='flex flex-row gap-2'>
				<View className={'w-2/3'}>
					<CustomInput
						className={'bg-[#e8f0fe]'}
						mask={'99999-999'}
						variant='mask'
						placeholder='Digite seu CEP'
						value={cep}
						inputMode={'numeric'}
						onChange={e => setCep(e.target.value)}
					/>
				</View>
				<View className={'w-1/3'}>
					<CustomButton
						label={'OK'}
						disabled={loading || cep.length < 9}
						onClick={calcularFrete}
					/>
				</View>
			</View>

			{loading && (
				<View className='flex justify-center py-4'>
					<Loading />
				</View>
			)}

			{!loading && freightOptions.length > 0 && (
				<View className='flex flex-col gap-3 mt-2'>
					<Text className='text-sm text-base-content/70'>Opções de entrega:</Text>

					{freightOptions.map(opcao => (
						<View
							key={opcao.id}
							className='flex flex-row items-center gap-3 p-3 border border-base-300 rounded-lg'>
							<View className='flex-1'>
								<Text className='font-semibold text-base-content block'>
									{formatDeliveryMessage(
										opcao.deadline,
										opcao.deadlineInHours,
										opcao.type === 'Retirada'
									)}
								</Text>
								<Text className='text-sm text-base-content/60 block'>{opcao.name}</Text>
							</View>
							<Text className='font-bold'>{formatCurrency(opcao.value)}</Text>
						</View>
					))}
				</View>
			)}
		</View>
	)
}
