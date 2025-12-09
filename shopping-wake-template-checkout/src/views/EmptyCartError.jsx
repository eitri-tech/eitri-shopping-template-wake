import { HeaderTemplate } from 'shopping-wake-template-shared'
import Eitri from 'eitri-bifrost'
import { deleteCart } from '../services/CheckoutServices'
import { logScreenView, sendLogError } from '../services/TrackingService'
import EmptyCart from '../components/EmptyCart/EmptyCart'

export default function EmptyCartError() {
	const PAGE = 'Checkout Erro Sacola vazia'

	useEffect(() => {
		logScreenView(PAGE, 'EmptyCartError')
		sendLogError({ message: 'Erro carrinho vazio' }, '', {
			screen: 'EmptyCartError'
		})
	}, [])

	const closeApp = async () => {
		Eitri.close()
	}

	return (
		<Page
			bottomInset
			title={PAGE}>
			<EmptyCart />
		</Page>
	)
}
