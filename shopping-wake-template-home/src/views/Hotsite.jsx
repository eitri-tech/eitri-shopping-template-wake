import Eitri from 'eitri-bifrost'
import { View, Loading } from 'eitri-luminus'

import { getHotsiteData } from '../services/HotsiteService'
import { openPageError, openProduct } from '../services/NavigationService'
import { logScreenView, logEvent } from '../services/TrackingService'
import { resolveFilterQueryString } from '../services/ProductService'
import { detachUrl, getDefaultSort, slugify } from '../utils/Util'

import { LIST_ORDERING, PRODUCT_SORT_TYPE, SORT_DIRECTION, VIEW_MODE } from '../utils/Constants'
import SearchResultsWrapper from '../components/product/SearchResultsWrapper'
import SimpleBanner from '../components/banner/SimpleBanner'
import ProductListHeader from '../components/Header/ProductListHeader'
import FilterModal from '../components/Modal/FilterModal'
import SortModal from '../components/Modal/SortModal'
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll'
import { NotificationProvider } from '../components/Notification/NotificationProvider'
import filterIcon from '../assets/images/faFilter.svg'
import SearchInput from '../components/SearchInput/SearchInput'

import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText } from 'shopping-wake-template-shared'

const listOrdering = LIST_ORDERING
export default function Hotsite(props) {
	// variaveis com valor padrão
	const params = props?.location?.state
	const titleAux = `${params?.title?.trim() || 'Catálogo'}`
	const hotsiteUrl = params?.url || ''
	const defaultItemsPerPage = 24
	const defaultSort = getDefaultSort(props?.location?.state, PRODUCT_SORT_TYPE.RELEASE_DATE, SORT_DIRECTION.DESC)
	const queryString = hotsiteUrl.replace(/^.*?\?/, '') // add logica para url com filtros vindo do cadastro na wake
	const moreFilters = resolveFilterQueryString(queryString)
	const initialParams = {
		first: params.quantity ? parseInt(params.quantity) : defaultItemsPerPage,
		sortKey: params.sort || defaultSort.sortType,
		sortDirection: params.sortDirection || defaultSort.direction,
		after: null,
		filter: [...(params?.filter || []), ...(moreFilters || [])]
	}

	// loading
	const [title, setTitle] = useState(titleAux)
	const [isPristine, setIsPristine] = useState(true)
	const [viewBackButton, setViewBackButton] = useState(true)
	const [scrollEnded, setScrollEnded] = useState(false)
	const [pageHasEnded, setPageHasEnded] = useState(false)

	// variáveis de produto
	const [searchParams, setSearchParams] = useState(null)
	const [products, setProducts] = useState([])
	const [totalProducts, setTotalProducts] = useState(0)
	const [searchLoading, setSearchLoading] = useState(true)
	const [banners, setBanners] = useState(null)
	const [activeViewMode, setActiveViewMode] = useState(VIEW_MODE.DOUBLE)

	// variáveis de filtro
	const [showFilterModal, setShowFilterModal] = useState(false)
	const [filterOptions, setFilterOptions] = useState([])
	const [selectedFilters, setSelectedFilters] = useState([])

	// variáveis de ordenação
	const [showSortModal, setShowSortModal] = useState(false)

	useEffect(() => {
		window.scroll(0, 0)
		resolveScrollActions()

		if (params?.backButton) {
			setViewBackButton(JSON.parse(params.backButton))
		}

		resolveProducts(initialParams, true)

		Eitri.navigation.setOnResumeListener(() => {
			logScreenView(title, 'Hotsite')
		})
	}, [])

	const onScrollEnd = () => {
		if (!searchLoading && !pageHasEnded) {
			resolveProducts(searchParams)
		}
	}

	useEffect(() => {
		if (isPristine) return

		try {
			applyFilter(selectedFilters)
		} catch (e) {
			console.error('useEffect selectedFilters', e)
		}
	}, [selectedFilters])

	const resolveScrollActions = () => {
		Eitri.eventBus.subscribe({
			channel: 'onUserTappedActiveTab',
			callback: _ => {
				Eitri.navigation.back()
			}
		})
	}

	/**
	 * Resolve a operação de busca de produtos, por categoria, marca, hotsite, etc.
	 * @param {string} params.brandId - Amarca onde os produtos serão buscados.
	 * @param {number} params.id - O identificador do grupo (categoryId, brandId, hotsiteId, etc).
	 * @param {string} params.sort - A ordem em que os produtos devem ser retornados.
	 * @param {string} params.sortDirection - A direção da operação (por exemplo, 'asc' ou 'desc').
	 * @param {number} params.quantity - A quantidade de itens a serem devolvidos por paginação.
	 * @param {string} params.cursor - O cursor para a paginação.
	 * @returns {Array<Product>} products - Lista de produtos
	 */
	const resolveProducts = async (searchParams, firstPage = false) => {
		setSearchLoading(true)
		if (firstPage) {
			searchParams.after = null
			setPageHasEnded(false)
			setScrollEnded(false)
		}

		try {
			const basicUrl = detachUrl(hotsiteUrl)
			const result = await getHotsiteData(basicUrl, searchParams)
			let newTitle = titleAux

			if (result) {
				const { banners, contents, products, seo, aggregations } = result

				if (firstPage) {
					// TODO - Implementar lógica para Conteúdos e SEO
					if (banners) {
						const bannersTop = banners.filter(b => b.position?.toLowerCase() === 'mobile topo')
						setBanners(bannersTop)
					}

					if (seo) {
						const contentTitle = seo.find(c => c.type?.toLowerCase() === 'title')
						if (contentTitle) {
							newTitle = contentTitle.content?.replace(/:.*/g, '')
							if (newTitle && newTitle !== title) {
								setTitle(newTitle)
							}
						}
					}

					if (isPristine) {
						logScreenView(newTitle, 'Hotsite')
					}

					setIsPristine(false)

					setProducts(products.nodes)
				} else {
					setProducts(prev => [...prev, ...products.nodes])
				}

				searchParams.after = products.pageInfo.endCursor
				setSearchParams(searchParams)

				setTotalProducts(products.totalCount)
				setFilterOptions(aggregations?.filters || [])

				if (products.nodes.length <= 0) {
					setPageHasEnded(true)
				} else {
					logEvent('view_item_list', {
						currency: 'BRL',
						item_list_id: slugify(newTitle),
						item_list_name: newTitle,
						items: products.nodes.map(item => ({
							item_id: item.productId,
							item_name: item.productName
						}))
					})
				}

				setScrollEnded(false)
				setSearchLoading(false)
				setIsPristine(false)
				return
			}

			if (firstPage) {
				// se terminar com número, pode ser uma url de produto
				const lastPart = basicUrl.replace(/.*-/g, '')
				if (!isNaN(lastPart)) {
					openProduct(lastPart)
					return
				}

				openPageError(true)
			}

			setSearchLoading(false)
		} catch (e) {
			console.error('Error resolve hotsite:', e, searchParams)
		}
	}

	const cleanFilters = () => {
		const _searchParams = { ...searchParams }
		_searchParams.filter = []

		setSelectedFilters([])
		setShowFilterModal(false)
		resolveProducts(_searchParams, true)
	}

	const goToBack = () => {
		Eitri.navigation.back()
	}

	const handlerSelectedFilters = async filters => {
		setSelectedFilters(filters)
	}

	const applyFilter = async selectedFilters => {
		const _searchParams = { ...searchParams }

		const newFilter = {}
		selectedFilters.map(item => {
			const _variation = item.split('/')
			if (!newFilter[_variation[0]]) newFilter[_variation[0]] = []
			newFilter[_variation[0]].push(_variation[1])
		})
		_searchParams.filter = Object.entries(newFilter).map(([key, value]) => ({
			field: key,
			values: value
		}))
		resolveProducts(_searchParams, true)
	}

	const applySort = async (sortType, sortDirection) => {
		const _searchParams = { ...searchParams }
		_searchParams.sortKey = sortType
		_searchParams.sortDirection = sortDirection
		resolveProducts(_searchParams, true)
		setShowSortModal(false)
	}

	return (
		<NotificationProvider>
			<Page
				title={title}
				statusBarTextColor='black'>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={title} />
				</HeaderContentWrapper>

				{(products?.length > 0 || selectedFilters?.length > 0) && (
					<View className='flex flex-row items-center w-screen gap-4 p-4'>
						<View
							className='flex flex-row p-1 border border-black py-2 px-4 rounded-[5px] flex-1'
							onClick={() => setShowSortModal(true)}>
							<Text className='text'>Ordenar</Text>
						</View>

						<View
							className='flex flex-row gap-2 py-2 px-4 bg-primary border border-primary rounded-[5px]'
							onClick={() => setShowFilterModal(true)}>
							<Text className='text'>Filtrar</Text>
							<Image src={filterIcon} />
							{selectedFilters?.length > 0 && (
								<Text className='text-xs pl-1'>{`(${selectedFilters.length})`}</Text>
							)}
						</View>
					</View>
				)}

				{banners && (
					<View className={'mb-4'}>
						<SimpleBanner
							data={banners}
							wide
						/>
					</View>
				)}

				<InfiniteScroll onScrollEnd={onScrollEnd}>
					<SearchResultsWrapper
						searchResults={products}
						isLoading={searchLoading}
						itemsPerRow={
							activeViewMode === VIEW_MODE.GRID ? 4 : activeViewMode === VIEW_MODE.DOUBLE ? 2 : 1
						}
						isPristine={isPristine}
					/>
				</InfiniteScroll>

				<FilterModal
					show={showFilterModal}
					onClose={() => setShowFilterModal(false)}
					filterOptions={filterOptions}
					selectedFilters={selectedFilters}
					setSelectedFilters={handlerSelectedFilters}
					cleanFilters={cleanFilters}
				/>

				<SortModal
					show={showSortModal}
					onClose={() => setShowSortModal(false)}
					currentSortType={searchParams?.sortKey || defaultSort.sortType}
					currentSortDirection={searchParams?.sortDirection || defaultSort.direction}
					onChange={applySort}
				/>

				<View bottomInset='auto' />
			</Page>
		</NotificationProvider>
	)
}
