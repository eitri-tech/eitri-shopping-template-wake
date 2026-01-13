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

export const queryBasicContentByHotsiteId = `query ($hotsiteId: Long!, $partnerAccessToken: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!, $filter: [ProductFilterInput]) {
  hotsite(hotsiteId: $hotsiteId, partnerAccessToken: $partnerAccessToken) {
    ${hotsiteInfo}
    ${bannerInfo}
    ${contentInfo}
    ${productInfoWithParams}
    ${seoInfo}
  }
}`

export const queryBasicContentByHotsiteUrl = `query ($url: String, $partnerAccessToken: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!, $filter: [ProductFilterInput]) {
  hotsite(url: $url, partnerAccessToken: $partnerAccessToken) {
    ${hotsiteInfo}
    ${bannerInfo}
    ${contentInfo}
    ${productInfoWithParams}
    ${seoInfo}
  }
}`

export const queryAllContentHotsiteByUrl = `query ($url: String, $partnerAccessToken: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!, $filter: [ProductFilterInput]) {
  hotsite(url: $url, partnerAccessToken: $partnerAccessToken) {
    ${aggregationInfo}
    ${hotsiteInfo}
    ${bannerInfo}
    ${contentInfo}
    ${productInfoWithParams}
    ${seoInfo}
  }
}`

export const queryBannersAndProductsByHotsite = `query ($url: String, $partnerAccessToken: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!) {
  hotsite(url: $url, partnerAccessToken: $partnerAccessToken) {
    ${aggregationInfo}
    ${bannerInfo}
    ${productInfoWithParams}
  }
}`

export const queryProductsByHotsite = `query ($url: String, $partnerAccessToken: String, $first: Int, $after: String, $sortKey: ProductSortKeys!, $sortDirection: SortDirection!, $filter: [ProductFilterInput]) {
  hotsite(url: $url, partnerAccessToken: $partnerAccessToken) {
    ${aggregationInfo}
    ${productInfoWithParams}
  }
}`
