import Eitri from 'eitri-bifrost'

export default function EmptyCart(props) {
	const { icon } = props
	const [hasBackButton, setHasBackButton] = useState(false)

	useEffect(() => {
		startPage()
	}, [])

	const startPage = async () => {
		const startParams = await Eitri.getInitializationInfos()

		// Se tem tabIndex na inicialização, não foi aberto pela bottom navigation
		if (!startParams?.tabIndex) {
			setHasBackButton(true)
		}
	}

	const onPress = () => {
		Eitri.navigation.back()
	}

	return (
		<View className='flex flex-col items-center justify-center flex-grow h-full'>
			<View className='w-11/12 max-w-md p-8 m-4 space-y-8'>
				<View className='text-center'>
					<Text className='text-sm font-bold tracking-wide block'>Sua sacola está vazia</Text>
					<Text className='text-xs text-neutral-600'>
						Navegue pelas categorias ou faça uma busca, e os produtos adicionados à sacola aparecerão aqui
					</Text>
				</View>

				{hasBackButton && (
					<View
						onClick={onPress}
						className='flex justify-center'>
						<Text className='text-sm underline text-center'>Voltar às compras</Text>
					</View>
				)}
			</View>
		</View>
	)
}
