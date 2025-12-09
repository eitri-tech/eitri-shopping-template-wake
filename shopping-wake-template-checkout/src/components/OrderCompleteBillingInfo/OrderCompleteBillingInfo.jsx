import Eitri from 'eitri-bifrost'
import { useCheckout } from '../../providers/UseCheckout'
import { openOrderDetails } from '../../services/NavigationService'
import { CiClock2 } from 'react-icons/ci'
import { FaRegCopy } from 'react-icons/fa'
import { BsPrinter } from 'react-icons/bs'

export default function OrderCompleteBillingInfo(props) {
	const { ...rest } = props
	const { order } = useCheckout()

	const copyBarcodeLine = async () => {
		await Eitri.clipboard.setText({
			text: order?.billingDetails?.barcodeLine
		})
	}

	const goToOrders = async () => {
		openOrderDetails(order?.id)
		Eitri.close()
	}

	const openBilling = () => {
		Eitri.openBrowser({ url: order?.billingDetails?.billingDownloadUrl, inApp: true })
	}

	return (
		<View {...rest}>
			<View className='rounded-lg border border-gray-200 p-4'>
				{/* Instructions */}
				<View className='mb-4'>
					<Text className='mb-2 text-lg font-bold text-gray-800 block'>
						Você pode pagar até a data de vencimento do boleto.
					</Text>
					<Text className='text-sm text-gray-600'>
						Copie a linha digitável para pagar pelo Internet Banking. Se preferir pagar em qualquer banco,
						caixa eletrônico ou casa lotérica, basta imprimir o boleto gerado.
					</Text>
				</View>

				{/* Info Box */}
				<View className='mt-2 flex items-center gap-2 rounded-md bg-gray-100 p-2'>
					<CiClock2 />
					<Text className='text-xs text-gray-700'>
						O processo de pagamento pode levar até dois dias úteis para ser concluído.
					</Text>
				</View>

				{/* Barcode Line */}
				<View className='mt-6 rounded-md border border-dashed border-gray-300 bg-gray-50 p-3'>
					<Text className='break-all text-center font-mono text-sm text-gray-600'>
						{order?.billingDetails?.barcodeLine}
					</Text>
				</View>

				{/* Action Buttons */}
				<View className='mt-6 flex flex-col gap-3'>
					<View
						onClick={copyBarcodeLine}
						className='cursor-pointer rounded border border-primary p-3 text-center'>
						<View className='flex items-center justify-center gap-2'>
							<FaRegCopy />
							<Text className='font-semibold'>Copiar linha digitável</Text>
						</View>
					</View>
					<View
						onClick={openBilling}
						className='cursor-pointer rounded bg-primary p-3 text-center text-white transition-colors hover:bg-gray-700'>
						<View className='flex items-center justify-center gap-2'>
							<BsPrinter />
							<Text className='font-semibold text-white'>Abrir Boleto</Text>
						</View>
					</View>
				</View>

				{/* My Orders Link */}
				<View
					className='mt-6 flex justify-center'
					onClick={goToOrders}>
					<Text className='cursor-pointer text-sm font-bold text-primary-500 hover:underline'>
						Ver em meus pedidos
					</Text>
				</View>
			</View>
		</View>
	)
}
