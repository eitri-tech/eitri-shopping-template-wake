import Eitri from 'eitri-bifrost'
import { View } from 'eitri-luminus'

import { getProductsBySearch } from '../services/ProductService'
import { logError, logEvent, logScreenView } from '../services/TrackingService'

import { LIST_ORDERING, PRODUCT_SORT_TYPE, SORT_DIRECTION, VIEW_MODE } from '../utils/Constants'
import SearchResultsWrapper from '../components/product/SearchResultsWrapper'
import { BottomInset, HeaderContentWrapper, HeaderReturn } from 'shopping-wake-template-shared'

import FilterModal from '../components/Modal/FilterModal'
import { getDefaultSort } from '../utils/Util'
import SortModal from '../components/Modal/SortModal'
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll'
import { NotificationProvider } from '../components/Notification/NotificationProvider'
import SearchInput from '../components/SearchInput/SearchInput'

import filterIcon from '../assets/images/faFilter.svg'

const listOrdering = LIST_ORDERING

export default function Search(props) {
	const PAGE = 'Busca'

	// variaveis com valor padrão
	const params = props?.location?.state
	const defaultItemsPerPage = 24
	const defaultSort = getDefaultSort(props?.location?.state, PRODUCT_SORT_TYPE.RELEASE_DATE, SORT_DIRECTION.DESC)
	const initialParams = {
		first: params.quantity ? parseInt(params.quantity) : defaultItemsPerPage,
		sortKey: params.sort || defaultSort.sortType,
		sortDirection: params.sortDirection || defaultSort.direction,
		after: null,
		term: params.term || null,
		filter: params.filter || []
	}

	// loading
	const [isPristine, setIsPristine] = useState(true)
	const [searchLoading, setSearchLoading] = useState(false)

	// variáveis de produto
	const [searchParams, setSearchParams] = useState(null)
	const [products, setProducts] = useState([])
	const [totalProducts, setTotalProducts] = useState(0)
	const [activeViewMode, setActiveViewMode] = useState(VIEW_MODE.DOUBLE)

	// variáveis de filtro
	const [showFilterModal, setShowFilterModal] = useState(false)
	const [filterOptions, setFilterOptions] = useState([])
	const [selectedFilters, setSelectedFilters] = useState([])

	// variáveis de ordenação
	const [showSortModal, setShowSortModal] = useState(false)

	// variáveis de scroll
	const [scrollEnded, setScrollEnded] = useState(false)
	const [pageHasEnded, setPageHasEnded] = useState(false)

	useEffect(() => {
		const term = decodeURIComponent(props.location.state.term).trim()

		const inputElement = document.getElementById('search-input')
		if (inputElement) {
			inputElement.focus()
		}

		logScreenView(PAGE, 'Search')
	}, [])

	useEffect(() => {
		if (isPristine) return

		try {
			applyFilter(selectedFilters)
		} catch (e) {
			console.error('useEffect selectedFilters', e)
		}
	}, [selectedFilters])

	const onScrollEnd = () => {
		if (!searchLoading && !pageHasEnded) {
			resolveProducts(searchParams)
		}
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

	const initialSearch = async term => {
		resolveProducts(
			{
				...initialParams,
				term: term
			},
			true
		)
		setIsPristine(false)
	}

	/**
	 * Busca e grava a variavel de produtos que preencherá a tela.
	 * @param {object} searchParams - Variáveis do Graphql responsável pela busca
	 * @param {boolean} firstPage - Indica se a busca é a primeira página
	 * @returns {Array<Product>} products - Lista de produtos
	 */
	const resolveProducts = async (searchParams, firstPage = false) => {
		setSearchLoading(true)
		setIsPristine(false)

		if (firstPage) {
			window.scroll(0, 0)
			searchParams.after = null
			setPageHasEnded(false)
			setScrollEnded(false)
		}

		try {
			const result = await getProductsBySearch(searchParams)

			const products = result.products.nodes
			setTotalProducts(result.products.totalCount)
			setFilterOptions(result.aggregations.filters || [])

			searchParams.after = result.products.pageInfo.endCursor
			setSearchParams(searchParams)

			if (firstPage) {
				// setOriginalFiltersOptions(result.aggregations.filters || [])
				setProducts(products)
			} else {
				setProducts(prev => [...prev, ...products])
			}

			if (products.length <= 0) {
				setPageHasEnded(true)
			}

			setScrollEnded(false)
			logEvent('search', { search_term: searchParams.term, page_location: PAGE })
		} catch (e) {
			logError('Search getAndFillProducts', e)
			console.error('Error getAndFillProducts:', e, searchParams)
		}

		setSearchLoading(false)
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

	const applySort = async (sortType, sortDirection) => {
		const _searchParams = { ...searchParams }
		_searchParams.sortKey = sortType
		_searchParams.sortDirection = sortDirection
		resolveProducts(_searchParams, true)
		setShowSortModal(false)
	}

	const handleInputSubmit = async term => {
		await resolveProducts({ ...initialParams, term }, true)
	}

	return (
		<NotificationProvider>
			<Page title={PAGE}>
				<HeaderContentWrapper className={'justify-between'}>
					<HeaderReturn />
					<SearchInput onSubmit={handleInputSubmit} />
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

				{isPristine ? (
					<View
						className='flex flex-col justify-center items-center'
						height='80vh'>
						<Text className='font text-center mb-4 font-bold'>Nos diga o que você está procurando</Text>
					</View>
				) : (
					<InfiniteScroll onScrollEnd={onScrollEnd}>
						<SearchResultsWrapper
							searchResults={products}
							isLoading={searchLoading}
							itemsPerRow={
								activeViewMode === VIEW_MODE.GRID ? 4 : activeViewMode === VIEW_MODE.DOUBLE ? 2 : 1
							}
							isPristine={isPristine}
							search={initialSearch}
						/>
					</InfiniteScroll>
				)}

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

				<BottomInset />
			</Page>
		</NotificationProvider>
	)
}
