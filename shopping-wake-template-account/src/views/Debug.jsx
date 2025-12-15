import Eitri from 'eitri-bifrost'
import { Wake } from 'eitri-shopping-wake-shared'
import { HeaderContentWrapper, HeaderReturn } from 'shopping-wake-template-shared'

export default function Debug(props) {
	const [info, setInfo] = useState(null)
	const [error, setError] = useState(null)

	const backToPage = () => {
		Eitri.navigation.back()
	}

	const cleanCache = async () => {
		try {
			await Eitri.sharedStorage.clear()
		} catch (e) {
			console.error('cleanCache', e)
		}
    }
    
    const getGlobalZipCode = async () => {
        try {
            const zipCode = await Wake.store.getGlobalZipCode()
            console.log('getGlobalZipCode', zipCode)
			setInfo(zipCode)

			const t = await Eitri.sharedStorage.getItem('globalZipCode')
			console.log('getGlobalZipCode GLOBAL_ZIP_CODE_KEY >>>', t)
		} catch (e) {
			console.error('cleanCache', e)
		}
    }
    
    const getGlobalPartner = async () => {
        try {
            const partner = await Wake.store.getPartnerAccessToken()
            console.log('getGlobalPartner', partner)
			setInfo(partner)
		} catch (e) {
			console.error('cleanCache', e)
		}
    }
    
    const copy = async () => {
        if (!info) return

        Eitri.clipboard.setText({
            text: typeof info !== 'string' ? JSON.stringify(info) : info
        })
    }

	return (
		<Page title='Debug'>
			<HeaderContentWrapper>
				<View className='flex flex-row justify-start items-center gap-4'>
					<HeaderReturn onClick={backToPage} />
					<Text className=''>Debug</Text>
				</View>
			</HeaderContentWrapper>

			<View className='flex flex-col gap-4 p-4'>
				<View
					onClick={cleanCache}
					className='bg-green-700 flex justify-center w-full px-4 py-2 rounded-lg'>
					<Text className='text-center text-white font-bold'>Limpar Cache</Text>
				</View>
				<View
					onClick={getGlobalZipCode}
					className='bg-green-700 flex justify-center w-full px-4 py-2 rounded-lg'>
					<Text className='text-center text-white font-bold'>Get Global Zip Code</Text>
                </View>
                <View
					onClick={getGlobalPartner}
					className='bg-green-700 flex justify-center w-full px-4 py-2 rounded-lg'>
					<Text className='text-center text-white font-bold'>Get Global Partner</Text>
				</View>

                {info && (
					<View className='flex justify-center w-full px-4 py-2' onClick={copy}>
						<Text className=''>{info}</Text>
					</View>
				)}
				{error && (
					<View className='flex justify-center w-full px-4 py-2'>
						<Text className='text-center text-red-500'>{error}</Text>
					</View>
				)}
			</View>

			<View bottomInset='auto' />
		</Page>
	)
}
