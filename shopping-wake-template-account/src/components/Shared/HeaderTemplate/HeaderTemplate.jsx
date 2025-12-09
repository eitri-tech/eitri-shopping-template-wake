import HeaderComponent from '../Header/HeaderComponent'
import HeaderLogo from '../Header/HeaderLogo'
import HeaderSearchIcon from '../Header/HeaderSearchIcon'
import HeaderWishList from '../Header/HeaderWishList'
import HeaderCart from '../Header/HeaderCart'
import HeaderReturn from '../Header/HeaderReturn'
import HeaderSearchInput from '../Header/HeaderSearchInput'
import Eitri from 'eitri-bifrost'
import headerLogoWhite from '../../../assets/images/logo_white.svg'
import headerLogoBlack from '../../../assets/images/logo_black.svg'
import { HeaderText } from 'shopping-wake-template-shared'

/**
 * HeaderTemplate component.
 *
 * Este componente é um template flexível para headers, permitindo diferentes combinações
 * de elementos, como logo, ícones, textos e carrinho, dependendo do tipo de header (`headerType`).
 *
 * @param {Object} props - As propriedades do componente.
 * @param {'logo'|'completeHeader'|'ReturnTextAndCart'|'ReturnTextAndSearch'|'ReturnAndSearchInput'|'ReturnAndLogo'|'ReturnAndText'|'ReturnAndCart'} props.headerType
 *   Define o tipo de header a ser renderizado, com parâmetros obrigatórios para cada tipo:
 *   - 'logo': Exibe apenas o logo.
 *   - 'completeHeader': Renderiza o header completo com logo, busca, wishlist e carrinho.
 *       - **Parâmetros obrigatórios:**
 *         - `props.navigateToSearch` (Função para navegação ao clicar no ícone de busca).
 *         - `props.navigateToWishList` (Função para navegação ao clicar no ícone de wishlist).
 *         - `props.quantityOfItems` (Quantidade de itens no carrinho).
 *         - `props.navigateToCart` (Função para navegação ao clicar no ícone do carrinho).
 *   - 'ReturnTextAndCart': Renderiza um header com botão de retorno, texto central e carrinho.
 *       - **Parâmetros obrigatórios:**
 *         - `props.contentText` (Texto exibido no centro do header).
 *         - `props.quantityOfItems` (Quantidade de itens no carrinho).
 *         - `props.navigateToCart` (Função para navegação ao clicar no ícone do carrinho).
 *   - 'ReturnTextAndSearch': Renderiza um header com botão de retorno, texto central e ícone de busca.
 *       - **Parâmetros obrigatórios:**
 *         - `props.contentText` (Texto exibido no centro do header).
 *         - `props.navigateToSearch` (Função para navegação ao clicar no ícone de busca).
 *   - 'ReturnAndSearchInput': Renderiza um header com botão de retorno e barra de busca.
 *       - **Parâmetros obrigatórios:**
 *         - `props.searchTerm` (Termo de busca atual para o input de busca).
 *         - `props.setSearchTerm` (Função para atualizar o termo de busca).
 *         - `props.search` (Função para executar a busca ao enviar o termo).
 *   - 'ReturnAndLogo': Renderiza um header com botão de retorno e logo centralizado.
 *   - 'ReturnAndText': Renderiza um header com botão de retorno e texto centralizado.
 *       - **Parâmetros obrigatórios:**
 *         - `props.contentText` (Texto exibido no centro do header).
 *   - 'ReturnAndCart': Renderiza um header com botão de retorno e carrinho.
 *       - **Parâmetros obrigatórios:**
 *         - `props.quantityOfItems` (Quantidade de itens no carrinho).
 *         - `props.navigateToCart` (Função para navegação ao clicar no ícone do carrinho).
 *
 * @param {Function} [props.navigateToSearch] - Função para navegação ao clicar no ícone de busca.
 * @param {Function} [props.navigateToWishList] - Função para navegação ao clicar no ícone de wishlist.
 * @param {number} [props.quantityOfItems] - Quantidade de itens no carrinho.
 * @param {Function} [props.navigateToCart] - Função para navegação ao clicar no ícone do carrinho.
 * @param {string} [props.contentText] - Texto exibido no header para tipos específicos.
 * @param {string} [props.searchTerm] - Termo de busca atual para o input de busca.
 * @param {Function} [props.setSearchTerm] - Função para atualizar o termo de busca.
 * @param {Function} [props.search] - Função para executar a busca ao enviar o termo.
 * @param {Array} [props.filterOptions] - Opções de filtro exibidas no header.
 * @param {Function} [props.handleCategoryModal] - Função para abrir o modal de categorias.
 * @param {boolean} [props.showProductGrid] - Indica se deve exibir o grid de produtos.
 * @param {number} [props.itemsPerRow] - Quantidade de itens por linha no grid de produtos.
 * @param {Function} [props.handleItemsPerRow] - Função para manipular a quantidade de itens por linha.
 * @param {boolean} [props.scrollEffect] - Ativa ou desativa o efeito de scroll no header.
 *
 * @returns {JSX.Element} O header renderizado com os elementos configurados.
 */

export default function HeaderTemplate(props) {
	const {
		headerType,
		navigateToSearch,
		navigateToWishList,
		quantityOfItems,
		navigateToCart,
		contentText,
		searchTerm,
		setSearchTerm,
		search,
		filterOptions,
		handleCategoryModal,
		showProductGrid,
		itemsPerRow,
		handleItemsPerRow,
		scrollEffect
	} = props

	const [backgroundColor, setBackgroundColor] = useState('')
	const [contentColor, setContentColor] = useState('')

	useEffect(() => {
		getHeaderColors()
	}, [])

	const getHeaderColors = async () => {
		const remoteConfig = await Eitri.environment.getRemoteConfigs()

		setBackgroundColor(remoteConfig?.appConfigs?.style?.headerBackgroundColorToken || 'primary-900')
		setContentColor(remoteConfig?.appConfigs?.style?.headerContentColorToken || 'accent-100')
	}

	const getLogo = async () => {
		return backgroundColor && backgroundColor.includes('primary') ? headerLogoWhite : headerLogoBlack
	}

	return (
		<HeaderComponent
			backgroundColor={backgroundColor}
			contentColor={contentColor}
			filterOptions={filterOptions}
			handleCategoryModal={handleCategoryModal}
			showProductGrid={showProductGrid}
			itemsPerRow={itemsPerRow}
			scrollEffect={scrollEffect}
			handleItemsPerRow={handleItemsPerRow}>
			{headerType === 'logo' && (
				<HeaderLogo
					className='h-10'
					src={backgroundColor?.includes('primary') ? headerLogoWhite : headerLogoBlack}
				/>
			)}
			{headerType === 'completeHeader' && (
				<>
					<HeaderLogo
						className='h-10'
						src={backgroundColor?.includes('primary') ? headerLogoWhite : headerLogoBlack}
					/>
					<View className='flex justify-end flex-grow'>
						<HeaderSearchIcon
							navigateToSearch={navigateToSearch}
							contentColor={contentColor}
						/>
						<HeaderWishList
							navigateToWishList={navigateToWishList}
							contentColor={contentColor}
						/>
					</View>
					<HeaderCart
						quantityOfItems={quantityOfItems}
						backgroundColor={backgroundColor}
						textColor={backgroundColor}
						iconColor={contentColor}
						navigateToCart={navigateToCart}
					/>
				</>
			)}
			{headerType === 'ReturnTextAndCart' && (
				<>
					<HeaderReturn iconColor={contentColor} />
					<HeaderText
						text={contentText}
						color={contentColor}
					/>
					<HeaderCart
						quantityOfItems={quantityOfItems}
						backgroundColor={backgroundColor}
						textColor={backgroundColor}
						iconColor={contentColor}
						navigateToCart={navigateToCart}
					/>
				</>
			)}
			{headerType === 'ReturnTextAndSearch' && (
				<>
					<HeaderReturn iconColor={contentColor} />
					<HeaderText
						text={contentText}
						color={contentColor}
					/>
					<HeaderSearchIcon
						navigateToSearch={navigateToSearch}
						contentColor={contentColor}
					/>
				</>
			)}
			{headerType === 'ReturnAndSearchInput' && (
				<>
					<HeaderReturn iconColor={contentColor} />
					<HeaderSearchInput
						backgroundColor={backgroundColor}
						contentColor={contentColor}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						search={search}
					/>
				</>
			)}
			{headerType === 'ReturnAndLogo' && (
				<View
					className='flex justify-between w-full'
					id='header-container-internal'>
					<HeaderReturn
						className='w-1/4'
						iconColor={contentColor}
					/>
					<HeaderLogo
						className='h-10'
						src={backgroundColor?.includes('primary') ? headerLogoWhite : headerLogoBlack}
					/>
					<View className='w-1/4' />
				</View>
			)}
			{headerType === 'ReturnAndText' && (
				<View
					className='flex justify-between w-full'
					id='header-container-internal'>
					<HeaderReturn
						className='w-5'
						iconColor={contentColor}
					/>
					<HeaderText
						text={contentText}
						color={contentColor}
					/>
					<View className='w-5' />
				</View>
			)}
			{headerType === 'ReturnAndCart' && (
				<>
					<HeaderReturn iconColor={contentColor} />
					<HeaderCart
						quantityOfItems={quantityOfItems}
						backgroundColor={backgroundColor}
						textColor={backgroundColor}
						iconColor={contentColor}
						navigateToCart={navigateToCart}
					/>
				</>
			)}
			{headerType === 'TextAndCart' && (
				<>
					<HeaderText
						text={contentText}
						color={contentColor}
					/>
					<HeaderCart
						quantityOfItems={quantityOfItems}
						backgroundColor={backgroundColor}
						textColor={backgroundColor}
						iconColor={contentColor}
						navigateToCart={navigateToCart}
					/>
				</>
			)}
			{headerType === 'Text' && (
				<>
					<HeaderText
						text={contentText}
						color={contentColor}
					/>
				</>
			)}
		</HeaderComponent>
	)
}
