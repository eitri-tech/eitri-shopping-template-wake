import Eitri from 'eitri-bifrost'
import { useState, useEffect } from 'react'
import backArrow from '../../assets/icons/back_arrow.svg'
import share from '../../assets/icons/share.svg'
import { logEvent } from '../../services/TrackingService'
import { HeaderContentWrapper, HeaderReturn, HeaderCart } from 'shopping-wake-template-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'

export default function Header(props) {
	const { product } = props
	const { cart } = useLocalShoppingCart()

	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 0) {
				setIsScrolled(true)
			} else {
				setIsScrolled(false)
			}
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	const handleSharedPDP = async () => {
		const config = await Eitri.environment.getRemoteConfigs()
		let domain = config?.providerInfo?.domain || config?.providerInfo?.host || ''
		domain = domain.trim().replace(/\/$/, '')
		if (!domain.startWith('http')) {
			domain = `https://${domain}`
		}
		let linkShared = `${domain}/${product.aliasComplete}?utm_source=app&utm_medium=product&utm_campaign=share&utm_content=${product?.productId}&utm_term=${product?.productName}`

		await Eitri.share.link({
			url: linkShared
		})

		logEvent('share', {
			method: 'App',
			content_type: 'Product',
			item_id: linkShared
		})
	}

	const navigateBack = () => {
		Eitri.navigation.back()
	}

	return (
		<HeaderContentWrapper className={'justify-between'}>
			<HeaderReturn />
			<HeaderCart cart={cart} />
		</HeaderContentWrapper>
	)

	// return (
	// 	<View
	// 		className={`fixed top-0 z-[999] w-screen transition-colors duration-500 ${isScrolled ? 'bg-base-100' : 'bg-transparent'}`}>
	// 		<View
	// 			topInset={'auto'}
	// 			className='bg-base-100 w-screen'
	// 		/>
	//
	// 		<View className='flex flex-row items-center justify-between p-4'>
	// 			<View onClick={navigateBack}>
	// 				<Image
	// 					src={backArrow}
	// 					width='20'
	// 					height='20'
	// 				/>
	// 			</View>
	// 			<View onClick={handleSharedPDP}>
	// 				<Image
	// 					src={share}
	// 					width='20'
	// 					height='20'
	// 				/>
	// 			</View>
	// 		</View>
	// 	</View>
	// )
}
