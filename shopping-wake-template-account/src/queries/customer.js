const productInfo = `
  available
  collection
  condition
  display
  freeShipping
  productId
  productName
  productVariantId
  sku
  variantName
  images {
    url
  }
  prices {
    listPrice
    price
    discountPercentage
  }`

export const getCustomerWishlist = `query Wishlist($customerAccessToken: String!, $productsIds: [Long]) {
  customer(customerAccessToken: $customerAccessToken){
    wishlist(productsIds: $productsIds){
    	products {
    	  ${productInfo}
    	}
    }
  }
}`

export const removeProductFromWishlist = `mutation ($customerAccessToken: String!, $productId: Long! ) {
  wishlistRemoveProduct(customerAccessToken:$customerAccessToken, productId: $productId) {
    productId
    productName
  }
}`
