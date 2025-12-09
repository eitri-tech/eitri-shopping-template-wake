import AddressCard from '../AddressCard/AddressCard'
import { useCheckout } from '../../providers/UseCheckout'
import Eitri from 'eitri-bifrost'
import BottomFixed from '../BottomFixed/BottomFixed'
import { CustomButton } from 'shopping-wake-template-shared'
import plus from '../../assets/images/plus.svg'
import { sendLogError } from '../../services/TrackingService'
import { isLoggedWithSimpleLogin, requestLogin } from '../../services/CustomerServices'

export default function DeliveryAddressSelector(props) {
	const { onNext, className, ...rest } = props
	const { loading, getUserAddresses, setDeliveryAddress, removeAddress, customer, checkout, loadCustomer } =
		useCheckout()

	const [addresses, setAddresses] = useState([])
	const [selectedAddress, setSelectedAddress] = useState(null)
	const [loadingSetAddress, setLoadingSetAddress] = useState(false)

	useEffect(() => {
		getUserAddresses().then(_addresses => {
			const currentAddress = _addresses.find(address => address.isCurrentDeliveryAddress)
			if (currentAddress) {
				setSelectedAddress(currentAddress)
			}
			setAddresses(_addresses)
		})
	}, [customer])

	const onRemoveAddress = async address => {
		if (await isLoggedWithSimpleLogin()) {
			requestLoginToEdit()
			return
		}
		await removeAddress(address)
		setAddresses(addresses.filter(_address => _address.id !== address.id))
	}

	const onEditAddress = async address => {
		if (await isLoggedWithSimpleLogin()) {
			requestLoginToEdit()
			return
		}
		Eitri.navigation.navigate({ path: 'AddressForm', state: address })
	}

	const goToAddressForm = async () => {
		if (await isLoggedWithSimpleLogin()) {
			requestLoginToEdit()
			return
		}
		Eitri.navigation.navigate({ path: 'AddressForm' })
	}

	const requestLoginToEdit = async callback => {
		try {
			await requestLogin()
			await loadCustomer()
			if (typeof callback === 'function') {
				callback()
			}
		} catch (e) {}
	}

	const handleDeliveryAddressSelection = async () => {
		try {
			setLoadingSetAddress(true)
			await setDeliveryAddress(selectedAddress)
			Eitri.navigation.navigate({ path: 'SelectFreight' })
			setLoadingSetAddress(false)
		} catch (e) {
			setSelectedAddress(false)
			sendLogError(e, '[DeliveryAddressSelector]handleDeliveryAddressSelection', {
				userEmail: customer.email,
				cartId: checkout.checkoutId
			})
		}
	}

	if (loading) {
		return (
			<View className={`flex w-screen justify-center ${className || ''}`}>
				<Loading />
			</View>
		)
	}

	return (
		<View className={`flex flex-col gap-4 ${className || ''}`}>
			<View>
				<Text className='text-base font-medium block'>Escolha o local de entrega</Text>
				<Text className='text-xs'>Para onde devemos enviar seu pedido.</Text>
			</View>

			<View className='flex flex-col gap-[10px]'>
				{addresses?.map(address => (
					<AddressCard
						key={address.id}
						title={address.title}
						fullAddress={address.fullAddress}
						isSelected={selectedAddress?.id === address?.id}
						isSelectable
						onSelect={() => setSelectedAddress(address)}
						onEdit={() => onEditAddress(address)}
						isRemovable={addresses.length > 1}
						onRemove={() => onRemoveAddress(address)}
					/>
				))}
			</View>

			<View
				className='flex items-center gap-2 pl-1 mb-10 cursor-pointer'
				onClick={goToAddressForm}>
				<Image
					src={plus}
					width={16}
					height={16}
				/>
				<Text className='text-sm text-neutral-900'>Adicionar um novo endereço</Text>
			</View>

			<BottomFixed>
				<CustomButton
					isLoading={loadingSetAddress}
					disabled={!selectedAddress}
					onClick={handleDeliveryAddressSelection}
					textClassName='!text-sm'
					label='Continuar'
				/>
			</BottomFixed>
		</View>
	)
}
