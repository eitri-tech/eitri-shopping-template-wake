export const PROVIDER = {
	VTEX: 'VTEX',
	WAKE: 'WAKE',
	DECO: 'DECO'
}

export const ACTION_TYPE = {
	OPEN_PRODUCT: 'OPEN_PRODUCT'
}

export const INFO_TYPE = {
	BANNER: 'BANNER',
	CONTENT: 'CONTENT',
	PRODUCTS: 'PRODUCTS',
	SINGLE_PRODUCT: 'SINGLE_PRODUCT',
	BEST_SELLER_PRODUCTS: 'BEST_SELLER_PRODUCTS',
	NEW_PRODUCTS: 'BEST_SELLER_PRODUCTS',
	CATEGORY: 'CATEGORY'
}

export const PRODUCT_GROUP = {
	BRAND: 'BRAND',
	CATEGORY: 'CATEGORY',
	HOTSITE: 'HOTSITE'
}

export const PRODUCT_SORT_TYPE = {
	NAME: 'NAME',
	SALES: 'SALES',
	PRICE: 'PRICE',
	DISCOUNT: 'DISCOUNT',
	RANDOM: 'RANDOM',
	RELEASE_DATE: 'RELEASE_DATE',
	STOCK: 'STOCK'
}

export const SORT_DIRECTION = {
	ASC: 'ASC',
	DESC: 'DESC'
}

export const LIST_ORDERING = {
	key: 'ordering',
	title: 'Ordenar por',
	values: [
		{
			id: 'OrderByTopSaleDESC',
			categoryKey: 'ordering',
			name: 'Mais vendidos',
			sortType: PRODUCT_SORT_TYPE.SALES,
			direction: SORT_DIRECTION.DESC,
			visible: true
		},
		{
			id: 'OrderByReleaseDateDESC',
			categoryKey: 'ordering',
			name: 'Lançamentos',
			sortType: PRODUCT_SORT_TYPE.RELEASE_DATE,
			direction: SORT_DIRECTION.DESC,
			visible: true
		},
		{
			id: 'OrderByBestDiscountDESC',
			categoryKey: 'ordering',
			name: 'Descontos',
			sortType: PRODUCT_SORT_TYPE.DISCOUNT,
			direction: SORT_DIRECTION.DESC,
			visible: false
		},
		{
			id: 'OrderByPriceDESC',
			categoryKey: 'ordering',
			name: 'Maior preço',
			sortType: PRODUCT_SORT_TYPE.PRICE,
			direction: SORT_DIRECTION.DESC,
			visible: true
		},
		{
			id: 'OrderByPriceASC',
			categoryKey: 'ordering',
			name: 'Menor preço',
			sortType: PRODUCT_SORT_TYPE.PRICE,
			direction: SORT_DIRECTION.ASC,
			visible: true
		},
		{
			id: 'OrderByNameASC',
			categoryKey: 'ordering',
			name: 'De A a Z',
			sortType: PRODUCT_SORT_TYPE.NAME,
			direction: SORT_DIRECTION.ASC,
			visible: true
		},
		{
			id: 'OrderByNameDESC',
			categoryKey: 'ordering',
			name: 'De Z a A',
			sortType: PRODUCT_SORT_TYPE.NAME,
			direction: SORT_DIRECTION.DESC,
			visible: true
		}
	]
}

export const URI_TYPE = {
	PRODUCT: 'PRODUCT',
	HOTSITE: 'HOTSITE',
	REDIRECT: 'REDIRECT',
	NOT_FOUND: 'NOT_FOUND',
	PARTNER: 'PARTNER',
	BUY_LIST: 'BUY_LIST'
}

export const CMS_PRODUCT_SORT = {
	name_asc: 'OrderByNameASC',
	name_desc: 'OrderByNameDESC',
	orders_desc: 'OrderByTopSaleDESC',
	price_asc: 'OrderByPriceASC',
	price_desc: 'OrderByPriceDESC',
	release_desc: 'OrderByReleaseDateDESC',
	score_desc: 'OrderByScoreDESC',
	best_discounts_desc: 'OrderByBestDiscountDESC',
	top_selling_desc: 'OrderByTopSaleDESC',
	best_reviews_desc: 'OrderByReviewRateDESC'
}

export const VIEW_MODE = {
	GRID: 'GRID',
	DOUBLE: 'DOUBLE',
	SINGLE: 'SINGLE'
}
