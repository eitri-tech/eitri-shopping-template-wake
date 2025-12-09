import Eitri from 'eitri-bifrost'
import { CustomButton, HeaderReturn, HeaderContentWrapper } from 'shopping-wake-template-shared'
import { logScreenView } from '../services/TrackingService'

export default function CardList() {
	const PAGE = 'Meus Cartões'

	useEffect(() => {
		logScreenView(PAGE, 'CardList')
	}, [])

	const goToAddCard = () => {
		Eitri.navigation.navigate({ path: 'AddCard' })
	}

	return (
		<Page
			bottomInset
			topInset
			title={PAGE}>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			<View className='flex h-full flex-col bg-gray-50 p-4'>
				<View className='mb-6 flex items-center justify-between'>
					<Text className='text-2xl font-bold'>Meus Cartões</Text>
					<CustomButton
						label='Adicionar Novo'
						onClick={goToAddCard}
					/>
				</View>

				{/* Placeholder for card list */}
				<View className='flex flex-grow items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center'>
					<View>
						<Text className='text-lg font-semibold text-gray-700'>Nenhum cartão cadastrado</Text>
						<Text className='mt-2 text-sm text-gray-500'>
							Adicione um cartão de crédito para agilizar suas futuras compras.
						</Text>
					</View>
				</View>
			</View>
		</Page>
	)
}
