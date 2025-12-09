import Eitri from 'eitri-bifrost'
import { logScreenView } from '../services/TrackingService'
import { useEffect, useState } from 'react'

export default function GenericError() {
	const PAGE = 'Checkout Erro genérico'

	useEffect(() => {
		logScreenView(PAGE, 'GenericError')
	}, [])

	const onClick = () => {
		Eitri.close()
	}

	return (
		<Page title={PAGE}>
			<View className='flex h-screen flex-col items-center justify-center p-4'>
				{/* Text Content */}
				<View className='space-y-4'>
					<Text className='text-sm font-bold block text-center'>Ocorreu um erro inesperado.</Text>
					<Text className='text-xs block text-center'>
						Tente novamente voltando para a etapa anterior, ou tente novamente em alguns instantes.
					</Text>
				</View>

				{/* Back Button */}
				<View className='mt-8'>
					<View
						onClick={onClick}
						className='cursor-pointer py-2'>
						<Text className='text-xs underline'>Voltar</Text>
					</View>
				</View>
			</View>
		</Page>
	)
}
