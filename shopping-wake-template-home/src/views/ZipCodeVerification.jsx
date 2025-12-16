import Eitri from 'eitri-bifrost'
import { CustomButton, CustomInput } from 'shopping-wake-template-shared'
import { getPartnerByZipCode, startFlowByRegion } from '../services/PartnerService'
import { SlLocationPin } from "react-icons/sl"
import { sendLogError } from '../services/TrackingService'

export default function ZipCodeVerification() {
	const PAGE = 'Cadastro de Cep'

	const [zipCode, setZipCode] = useState('')
	const [zipCodeError, setZipCodeError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	Eitri.navigation.addBackHandler(() => {
		console.log('Voltando da tela de CEP')
		return false
	})

	useEffect(() => {
		Eitri.navigation.setOnResumeListener(() => {
			console.log('Voltando da tela de CEP')
			return false
	})
	}, [])

	const verifyZipCode = async () => {
		const _zipCode = zipCode?.trim()?.replace(/\D/g, '')
		try {
			const result = await startFlowByRegion(_zipCode)
			if (!result) {
				setZipCodeError('Não foi possível encontrar resultados para seu CEP. Verifique seu CEP e tente novamente.')
				return
			}
			exitPage()

		} catch (e) {
			console.error('Erro ao iniciar o fluxo de compra', e)
			setZipCodeError('Ocorreu um erro ao verificar seu CEP. Tente novamente e se o problema persistir entre em contato com nossa central de atendimento.')
			
			if (_zipCode?.length === 8) {
				sendLogError(e, 'ZipCodeVerification', { zipCode: _zipCode })
			}
		}
	}

	const exitPage = () => {
		Eitri.navigation.clearBackHandlers()
		Eitri.navigation.back()
	}

	return (
		<View>
			{isLoading && <LoadingComponent fullScreen />}

			<View
				className={`
					${isLoading ? 'hidden' : 'block' } 
					h-screen w-full max-w-md mx-auto bg-gradient-to-br from-gray-50 to-gray-100
					flex items-center justify-center p-6`}>
				<View className='bg-white rounded-3xl shadow-xl p-8 w-full flex flex-col gap-6'>
					{/* Ícone de localização */}
					<View className='flex justify-center'>
						<View className='bg-orange-50 p-5 rounded-full'>
							<SlLocationPin
								size={48}
								className='text-orange-500'
							/>
						</View>
					</View>

					{/* Título */}
					<Text className='text-2xl font-bold text-gray-800 text-center leading-tight w-full'>
						Encontre produtos perto de você!
					</Text>

					{/* Descrição */}
					<View className='flex flex-col items-center justify-center w-full'>
						<Text className='text-gray-600 text-center text-sm leading-relaxed '>
							Faça seu pedido de forma rápida e segura pelo nosso site e receba em até 24 horas! Para
							isso, precisamos do seu CEP.
						</Text>
						<View className='my-2' />
						<Text className='text-gray-600 text-center text-sm leading-relaxed font-semibold'>
							Basta preencher o campo abaixo e pronto!
						</Text>
					</View>

					{/* Campo de entrada */}
					<View className='space-y-3'>
						<CustomInput
							id='zipCode'
							mask='99999-999'
							variant='mask'
							placeholder='Digite aqui o seu cep'
							value={zipCode}
							onChange={e => {
								setZipCode(e.target.value)
								setZipCodeError('') // Limpa erro ao digitar
							}}
							inputMode='numeric'
							backgroundColorError={zipCodeError ? 'negative-300' : ''}
						/>

						{/* Mensagem de erro */}
						{zipCodeError && (
							<View className='flex items-start bg-red-50 border border-red-200 rounded-lg p-2'>
								<Text className='text-red-700 text-sm text-center'>{zipCodeError}</Text>
							</View>
						)}

						{/* Botão */}
						<CustomButton
							className='w-full py-3.5 bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 text-sm'
							label='Verificar'
							onClick={verifyZipCode}
						/>
					</View>
				</View>
			</View>
		</View>
	)
}
