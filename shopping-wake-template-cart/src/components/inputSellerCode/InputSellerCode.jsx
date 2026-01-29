import { CustomButton, CustomInput, LoadingComponent } from 'shopping-wake-template-shared'
import { View, Text, TextInput, Button, Image } from 'eitri-luminus'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { formatCurrency } from '../../utils/Util'

export default function InputSellerCode(props) {

	const { cart, addMetadata, removeMetadata } = useLocalShoppingCart()
	
	const [code, setCode] = useState('')
	const [appliedCode, setAppliedCode] = useState('')
	const [loading, setLoading] = useState(false)
	const [msgError, setMsgError] = useState('')

	useEffect(() => {
		resolveSellerCode()
		setMsgError('')
	}, [cart])

	const resolveSellerCode = async () => {
		const sellerCode = getSellerCode()
		setAppliedCode(sellerCode)
		if (code === '' && sellerCode) {
			setCode(sellerCode)
		}
	}

	const getSellerCode = () => {
		const hasSellerCode = cart?.metadata?.find(m => m.key === 'utmContent' && m.value === 'vendedora')
		if (hasSellerCode) {
			const sellerCode = cart?.metadata?.find(m => m.key === 'utmTerm')
			return(sellerCode?.value || '')
		}
		return ''
	}

	const applyCode = async () => {
		const formatedCode = code.trim()
		setLoading(true)
		try {
			if (formatedCode) {
				const currentCodeApplied = getSellerCode()

				// Wake não tem Replace de Metadata, então precisamos remover o código anterior
				if (currentCodeApplied) {
					await removeMetadata(['utmContent', 'utmTerm'])
				}

				const metadata = [
					{ key: 'utmContent', value: 'vendedora' },
					{ key: 'utmTerm', value: `${formatedCode}` },
				]
				await addMetadata(metadata)
			} else {
				await removeMetadata(['utmContent', 'utmTerm'])
			}
		} catch (e) {
			setMsgError('Ocorreu uma falha ao aplicar o código do vendedor.')
		}
		setLoading(false)
	}

	return (
		<View className='mx-4 mb-4 p-4 bg-white border border-neutral-200 rounded'>
			<View className='flex flex-row gap-2 items-center justify-start mb-1'>
				<Text className='font-semibold text-base-content text-lg'>
					Código do vendedor{' '}
				</Text>
				{appliedCode && (
					<Text className='text-sm flex'>
						({appliedCode})
					</Text>
				)}
			</View>

			<View className='flex flex-row gap-2 items-center'>
				<View className={'w-2/3'}>
					<CustomInput
						className={'bg-neutral border-sm'}
						placeholder='Insira o código'
						value={code}
						onChange={e => setCode(e.target.value)}
					/>
				</View>
				<View className={'w-1/3'}>
					<CustomButton
						label={'Aplicar'}
						onClick={applyCode}
					/>
				</View>
			</View>
			
			{loading && (
				<View className='flex flex-row w-full items-center justify-start pt-2'>
					<Loading className='loading-xs text-gray-400' />
					<Text className='ml-4 text-sm text-gray-500'>Adicionando código</Text>
				</View>
			)}

			{msgError && (
				<View className='flex flex-row w-full items-center justify-start pt-2 px-2'>
					<Text className='text-red-600 text-sm'>{msgError}</Text>
				</View>
			)}
		</View>
	)
}
