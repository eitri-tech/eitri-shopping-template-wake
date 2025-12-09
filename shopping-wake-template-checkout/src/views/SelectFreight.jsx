import { HeaderContentWrapper, HeaderReturn } from 'shopping-wake-template-shared'
import StepIndicator from '../components/StepIndicator/StepIndicator'
import OrderSummary from '../components/OrderSummary/OrderSummary'
import DeliveryMethodSelector from '../components/DeliveryMethodSelector/DeliveryMethodSelector'
import { logScreenView } from '../services/TrackingService'
import { useEffect } from 'react'

export default function SelectFreight(props) {
	const PAGE = 'Checkout - Métodos de entrega'

	useEffect(() => {
		logScreenView(PAGE, 'SelectFreight')
	}, [])

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			<View className='flex flex-col gap-6'>
				<StepIndicator currentStep={1} />
				<OrderSummary className='px-4' />
				<DeliveryMethodSelector className='px-4' />
			</View>
		</Page>
	)
}
