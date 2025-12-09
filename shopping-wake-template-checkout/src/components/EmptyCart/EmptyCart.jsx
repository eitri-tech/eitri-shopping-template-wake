import Eitri from 'eitri-bifrost'
import icon from '../../assets/images/bag.svg'

export default function EmptyCart(props) {
	const onClick = () => {
		Eitri.close()
	}

	return (
		<View className='flex flex-col items-center absolute top-0 bottom-0 left-0 right-0 justify-center flex-grow h-full'>
			<View className='w-11/12 max-w-md p-8 m-4 space-y-8'>
				<View className='text-center'>
					<Text className='text-sm font-bold tracking-wide block'>Sua sacola está vazia</Text>
					<Text className='text-xs text-neutral-600'>Descubra suas peças favoritas.</Text>
				</View>

				<View
					onClick={onClick}
					className='flex justify-center'>
					<Text className='text-sm underline text-center'>Voltar às compras</Text>
				</View>
			</View>
		</View>
	)
}
