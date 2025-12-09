import { View } from 'eitri-luminus'
import { CustomCarousel } from 'shopping-wake-template-shared'
import arrowRight from '../../assets/images/arrow_white_right.svg'
import arrowLeft from '../../assets/images/arrow_white_left.svg'
import { calculeBestDimensions, computeBannerHeightVW, formatImageUrl } from '../../utils/Util'
import { useState, useEffect } from 'react'
import BannerFullScreenComponent from './BannerFullScreenComponent'

/**
 * Banner Full Screen
 * Exibe um carrossel de banners preenchendo toda a tela.
 * @param {Object} props - Objeto dividido em 'data' e 'params' com as informações para renderizar o carrossel.
 * @param {Array<Object>} data - Lista de banners a serem exibidos.
 * @param {Object} params - Propriedades adicionais para estilizar os banners.
 * @param {string} params.ratio - Proporção do banner no formato 'w:h'.
 * @param {boolean} params.hideTitle - Oculta o título do banner.
 * @param {boolean} params.hideBannerName - Oculta a informação bannerName.
 * @param {boolean} params.hideAltText - Oculta a informação altText.
 * @param {Object} props.searchParams - Parâmetros opcionais de busca caso o banner dispare uma navegação.
 * @param {PRODUCT_SORT_TYPE} props.searchParams.sort - A ordenação desejada dos produtos.
 * @param {SORT_DIRECTION} props.searchParams.sortDirection - Direção da ordenação (ex.: 'asc' ou 'desc').
 * @param {number} props.searchParams.quantity - Quantidade de itens por página.
 */
export default function SliderBannerFullScreen(props) {
	const { data, keyProduct, seo, ...params } = props

	const banners = Array.isArray(data) ? data : data ? [data] : []
	if (!banners || banners.length === 0) {
		console.warn('SliderBannerFullScreen: banners inválidos', banners)
		return null
	}

	const [currentSlide, setCurrentSlide] = useState(0)
	const [loading, setLoading] = useState(true)
	const [heightBanner, setHeightBanner] = useState()

	useEffect(() => {
		init()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [banners])

	const onChangeSlide = index => {
		setCurrentSlide(index)
	}

	const init = async () => {
		try {
			// Prefer calculating height based on first image like SimpleBanner
			if (banners && banners[0] && banners[0].bannerUrl) {
				const imgUrl = formatImageUrl(banners[0].bannerUrl)
				try {
					const dimensions = await calculeBestDimensions(imgUrl)
					const widthBanner = 100
					const computed = computeBannerHeightVW(dimensions, widthBanner, 1)
					setHeightBanner(computed)
				} catch (e) {
					console.warn('SliderBannerFullScreen: erro ao obter dimensões da imagem', e)
					setHeightBanner(undefined)
				}
			} else {
				setHeightBanner(undefined)
			}
		} catch (e) {
			console.error('SliderBannerFullScreen: erro no init', e)
			setHeightBanner(undefined)
		}
		setLoading(false)
	}

	// Render each banner using BannerFullScreenComponent (it will compute internal image height from first image)
	const containerHeight = typeof heightBanner !== 'undefined' ? `${heightBanner}vw` : 'auto'

	return (
		<View
			className='w-full'
			style={{ width: '100vw', height: containerHeight }}>
			{loading ? null : (
				<CustomCarousel
					autoPlay={params?.autoPlay ?? true}
					interval={params?.autoPlaySpeed || 5000}
					loop={true}
					onChange={onChangeSlide}
					style={{ width: '100%', height: containerHeight }}
					leftIcon={arrowLeft}
					rightIcon={arrowRight}>
					{banners.map(banner => (
						<BannerFullScreenComponent
							key={banner.bannerUrl || banner.id || Math.random()}
							data={[banner]}
							heightBanner={heightBanner}
							{...params}
						/>
					))}
				</CustomCarousel>
			)}
		</View>
	)
}
