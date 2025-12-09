import { dataProducts } from './product'

// banners
const bannerInfo = `banners {
  bannerId
  altText
  bannerName
  bannerUrl
  height
  order
  position
  searchTerms
  title
  urlOnClick
  width
}`

// conteudos
const contentInfo = `contents {
  contentId
  content
  height
  width
  position
  searchTerms
  title
}`

// produtos
const productInfo = `products (onlyMainVariant: true) {
  ${dataProducts}
}`
const productInfoWithParams = `products(first: $first, after: $after, sortDirection: $sortDirection, sortKey: $sortKey, onlyMainVariant: true, filters: $filter) {
  ${dataProducts}
}`

// seo
const seoInfo = `seo {
  content
  name
  type
}`

const hotsiteInfo = `
  id
  hotsiteId
  name
  url
  template
`
export const aggregationInfo = `
  aggregations {
    filters {
      field, origin, values { name quantity }
    }
  }
`

export const queryBasicContentByHotsiteId = `query ($hotsiteId: Long!) {
  hotsite(hotsiteId: $hotsiteId) {
    ${hotsiteInfo}
    ${bannerInfo}
    ${contentInfo}
    ${productInfo}
    ${seoInfo}
  }
}`

export const queryBasicContentByHotsiteUrl = `query ($url: String) {
  hotsite(url: $url) {
    ${hotsiteInfo}
    ${bannerInfo}
    ${contentInfo}
    ${productInfo}
    ${seoInfo}
  }
}`

export const queryAllContentHotsiteByUrl = `query ($url: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!, $filter: [ProductFilterInput]) {
  hotsite(url: $url) {
    ${aggregationInfo}
    ${hotsiteInfo}
    ${bannerInfo}
    ${contentInfo}
    ${productInfoWithParams}
    ${seoInfo}
  }
}`

export const queryBannersAndProductsByHotsite = `query ($url: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!) {
  hotsite(url: $url) {
    ${aggregationInfo}
    ${bannerInfo}
    ${productInfoWithParams}
  }
}`

export const queryProductsByHotsite = `query ($url: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!, $filter: [ProductFilterInput]) {
  hotsite(url: $url) {
    ${aggregationInfo}
    ${productInfoWithParams}
  }
}`
