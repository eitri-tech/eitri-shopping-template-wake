export const productNodeInfo = `
  productId
  productVariantId
  sku
  prices {
    listPrice
    price
    discountPercentage
  }
  images {
    url
  }
  productName
  productBrand {
    name
  }`

export const queryProduct = `query ($productId: Long!) {
  product(productId: $productId) {
    ${productNodeInfo}
  }
}`

export const dataProducts = `
  nodes {
    ${productNodeInfo}
  }
  pageInfo { endCursor }
  totalCount
`

export const queryBestSellerProducts = `query ($first: Int) {
  products(first: $first, sortDirection: ASC, sortKey: SALES, filters: {mainVariant:true, hasImages: true}) {
    ${dataProducts}
  }
}`

export const queryNewProducts = `query ($first: Int) {
  products(first: $first, sortDirection: DESC, sortKey: RELEASE_DATE, filters: {mainVariant:true, hasImages: true}) {
    ${dataProducts}
  }
}`

// Queries com filtro
export const queryProductByHotsiteUrl = `query ($url: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!) {
  hotsite(url: $url){
    seo { content type }
    products(first: $first, after: $after, sortDirection: $sortDirection, sortKey: $sortKey) {
      ${dataProducts}
    }
  }
}`

export const queryProductsBySearchParams = `query ($first: Int, $after: String, $search: [String], $sortKey: ProductSortKeys!, $sortDirection: SortDirection!) {
  products(first: $first, after: $after, sortDirection: $sortDirection, sortKey: $sortKey, filters: {search: $search, mainVariant:true, hasImages: true}) {
    ${dataProducts}
  }
}`

export const queryProductsByCategory = `query ($id: Long!, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!) {
  products(first: $first, after: $after, sortDirection: $sortDirection, sortKey: $sortKey, filters: {categoryId:[$id], mainVariant:true, hasImages: true}) {
    ${dataProducts}
  }
}`

export const queryProductsByBrand = `query ($id: Long!, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!) {
  products(first: $first, after: $after, sortDirection: $sortDirection, sortKey: $sortKey, filters: {categoryId:[$id], mainVariant:true, hasImages: true}) {
    ${dataProducts}
  }
}`

export const queryCategories = `query ($url: String!, $position: String) {
  menuGroups(url: $url, position: $position) {
    position
    menuGroupId
    name
    menus {
      menuId
      parentMenuId
      name
      level
      order
      link
      fullImageUrl
    }  
  }
}`

export const queryProductVariations = `query ($productId: Long!) {
  product(productId: $productId) {
    attributeSelections (selected: null) {
      selections {
        attributeId
        name
        displayType
        values {
          value
          available
          selected
        }
      }
    }
  }
}`

export const queryProductByVariation = `query ($productId: Long!, $selectedVariations: [AttributeFilterInput]) {
  product(productId: $productId) {
    attributeSelections (selected: $selectedVariations) {
      selectedVariant {
        id
        alias
        available
        productId
        productVariantId
      }
    }
  }
}`
