import { formatCurrency } from '../../utils/Util'
import { Loading } from 'shopping-wake-template-shared'

export default function InputCep(props) {
	const { actionCep, loadingShipping, shippingError, shippingOptions } = props
	const [cep, setCep] = useState('')

	const searchDataShipping = async () => {
		return await actionCep(cep)
	}

	return (
		<View>
			<View
				display='flex'
				alignItems='center'
				justifyContent='between'
				paddingVertical='big'>
				<Text
					color='primary-500'
					fontSize='small'>
					FRETE
				</Text>

				<View
					borderBottomWidth='hairline'
					display='flex'
					alignItems='center'>
					<TextInput
						mask='99999-999'
						inputMode='numeric'
						placeholder='DIGITE SEU CEP'
						borderHidden={true}
						marginBottom='none'
						paddingBottom='none'
						fontSize='quark'
						maxWidth='154px'
						value={cep}
						borderColor='accent-100'
						color='neutral-100'
						onChange={value => setCep(value)}
						onSubmit={searchDataShipping}
					/>
					<View
						onPress={searchDataShipping}
						paddingLeft='big'
						direction='row'
						alignItems='center'
						justifyContent='end'>
						<Text>Calcular</Text>
						<View paddingLeft='quark'>
							<Image
								iconKey='arrow-right'
								width={16}
								height={16}
							/>
						</View>
					</View>
				</View>
				{/* <Text fontSize="quark" textDecoration="underline">NÃO SEI MEU CEP</Text> */}
			</View>
			{loadingShipping && (
				<View
					direction='row'
					alignItems='center'
					justifyContent='end'
					marginBottom='small'>
					<Text marginRight='small'>Calculando frete</Text>
					<Loading
						width={10}
						height={10}
					/>
				</View>
			)}
			{shippingError && (
				<View
					direction='column'
					alignItems='center'
					justifyContent='center'
					color='negative-700'
					marginBottom='small'>
					{shippingError}
				</View>
			)}
			{shippingOptions && shippingOptions.length > 0 && (
				<View
					direction='column'
					alignItems='start'
					justifyContent='center'
					borderWidth='hairline'
					gap={16}
					marginBottom='small'
					padding='small'>
					<View direction='row'>
						<Image
							iconKey='truck'
							width={20}
							height={20}
						/>
						<Text
							fontSize='medium'
							marginLeft='nano'>
							Receba no seu endereço
						</Text>
					</View>
					{shippingOptions.map(option => (
						<View
							direction='row'
							justifyContent='between'
							width={'100%'}>
							<View direction='row'>
								<Text marginRight='small'>{option.name}</Text>
								<View
									borderRadius='pill'
									backgroundColor='primary-500'
									paddingHorizontal='small'>
									<Text
										color='primary-500'
										contentColor>
										{option.deadline > 1
											? `${option.deadline} dias úteis`
											: `${option.deadline} dia útil`}
									</Text>
								</View>
							</View>

							<Text>{formatCurrency(option.value)}</Text>
						</View>
					))}
				</View>
			)}
		</View>
	)
}
