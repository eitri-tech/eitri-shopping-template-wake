import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderReturn, LoadingComponent } from 'shopping-wake-template-shared'
import { getCustomer, getUserAddressesImpl, removeAddressImpl } from '../services/CustomerService'
import AddressCard from '../components/AddressCard/AddressCard'
import { navigate, PAGES } from '../services/NavigationService'

export default function Addresses(props) {
	const PAGE = 'Meus Endereços'
	const [isLoading, setIsLoading] = useState(true)
	const [addresses, setAddresses] = useState([])

	useEffect(() => {
		window.scroll(0, 0)
		init()
	}, [])

	const init = async () => {
		const customer = await getCustomer()
		try {
			const addresses = await getUserAddressesImpl(customer)
			setAddresses(addresses)
		} catch (e) {
			console.error('Error getting addresses', e)
		}

		setIsLoading(false)
	}

	const goToNewAddressForm = () => {
		navigate(PAGES.NEW_ADDRESS, { state: 'newAddress' }, false)
	}

	const onEditAddress = address => {
		navigate(PAGES.EDIT_ADDRESS, { state: address }, false)
	}

	const onRemoveAddress = async address => {
		await removeAddressImpl(address)
		setAddresses(addresses.filter(_address => _address.id !== address.id))
	}

	const backToPage = () => {
		Eitri.navigation.back()
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<View className='flex flex-row justify-start items-center gap-4'>
					<HeaderReturn onClick={backToPage} />
					<Text className=''>{PAGE}</Text>
				</View>
			</HeaderContentWrapper>

			<LoadingComponent
				fullScreen={true}
				isLoading={isLoading}
			/>

			<View className='flex flex-col gap-4 p-4 mb-4'>
				<Text className='text-lg font-bold w-full text-center'>Gerencie seus endereços de entrega</Text>

				{addresses?.map(address => (
					<AddressCard
						key={address.id}
						title={address.title}
						fullAddress={address.fullAddress}
						onEdit={() => onEditAddress(address)}
						isRemovable={addresses.length > 1}
						onRemove={() => onRemoveAddress(address)}
					/>
				))}

				<Button
					className='bg-primary text-primary-content w-full mt-4 !h-9 !min-h-9 !font-medium text-xs !rounded-none'
					onClick={goToNewAddressForm}>
					Adicionar novo endereço
				</Button>
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
