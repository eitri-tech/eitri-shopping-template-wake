import { aggregationInfo } from './hotsite'
import { dataProducts } from './product'

export const querySearchProducts = `
query (
  $term: String,
  $first: Int,
  $after: String,
  $sortKey: ProductSearchSortKeys!,
  $sortDirection: SortDirection!,
  $filter: [ProductFilterInput]) {
  search(query: $term, operation: AND) {
    ${aggregationInfo}
    products(
      first: $first, after: $after, 
      sortDirection: $sortDirection, sortKey: $sortKey, 
      filters: $filter) {
      ${dataProducts}
    }
  }
}`
