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

export const queryProduct = `query ($productId: Long!, $partnerAccessToken: String) {
  product(productId: $productId, partnerAccessToken: $partnerAccessToken) {
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

export const queryBestSellerProducts = `query ($first: Int, $partnerAccessToken: String) {
  products(partnerAccessToken: $partnerAccessToken, first: $first, sortDirection: ASC, sortKey: SALES, filters: {mainVariant:true, hasImages: true}) {
    ${dataProducts}
  }
}`

export const queryNewProducts = `query ($first: Int, $partnerAccessToken: String) {
  products(partnerAccessToken: $partnerAccessToken, first: $first, sortDirection: DESC, sortKey: RELEASE_DATE, filters: {mainVariant:true, hasImages: true}) {
    ${dataProducts}
  }
}`

// Queries com filtro
export const queryProductByHotsiteUrl = `query ($url: String, $partnerAccessToken: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!) {
  hotsite(url: $url, partnerAccessToken: $partnerAccessToken){
    seo { content type }
    products(first: $first, after: $after, sortDirection: $sortDirection, sortKey: $sortKey) {
      ${dataProducts}
    }
  }
}`

export const queryProductsBySearchParams = `query ($partnerAccessToken: String, $first: Int, $after: String, $search: [String], $sortKey: ProductSortKeys!, $sortDirection: SortDirection!) {
  products(partnerAccessToken: $partnerAccessToken, first: $first, after: $after, sortDirection: $sortDirection, sortKey: $sortKey, filters: {search: $search, mainVariant:true, hasImages: true}) {
    ${dataProducts}
  }
}`

export const queryProductsByCategory = `query ($id: Long!, $partnerAccessToken: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!) {
  products(first: $first, after: $after, sortDirection: $sortDirection, sortKey: $sortKey, filters: {categoryId:[$id], mainVariant:true, hasImages: true}) {
    ${dataProducts}
  }
}`

export const queryProductsByBrand = `query ($id: Long!, $partnerAccessToken: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!) {
  products(partnerAccessToken: $partnerAccessToken, first: $first, after: $after, sortDirection: $sortDirection, sortKey: $sortKey, filters: {categoryId:[$id], mainVariant:true, hasImages: true}) {
    ${dataProducts}
  }
}`

export const queryCategories = `query ($url: String!, $partnerAccessToken: String, $position: String) {
  menuGroups(url: $url, partnerAccessToken: $partnerAccessToken, position: $position) {
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

export const queryProductVariations = `query ($productId: Long!, $partnerAccessToken: String) {
  product(productId: $productId, partnerAccessToken: $partnerAccessToken) {
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

export const queryProductByVariation = `query ($productId: Long!, $partnerAccessToken: String, $selectedVariations: [AttributeFilterInput]) {
  product(productId: $productId, partnerAccessToken: $partnerAccessToken) {
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
