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
  alias
  aliasComplete
  averageRating
  newRelease
  addToCartFromSpot
  images {
    url
  }
  prices {
    listPrice
    price
    discountPercentage
    installmentPlans {
      displayName
      name
      installments {
        discount
        fees
        number
        value
        totalValue
      }
    }
    bestInstallment {
      name
      displayName
      discount
      fees
      number
      value
      totalValue
    }
    wholesalePrices {
      price
      quantity
    }
  }`

const attributeInfo = `
  attributes {
    attributeId
    name
    value
  }`

const informationInfo = `
  informations {
    id
    title
    type
    value
  }`

const attributeSelectionInfo = `
  attributeSelections (selected: $attrSelection) {
    selections {
	    attributeId
      name
      displayType
      values {
      	alias
        value
        available
		printUrl
        selected
      }
    }
    selectedVariant {
      id
      alias
      available
      productId
      productVariantId
      stock
      productVariantName
      attributes {
        attributeId
        name
        value
      }
      images(width: 596, height: 596) {
        fileName
        url
      }
      promotions {
        id
        content
        disclosureType
        stamp
        title
        endDate
      }
      prices {
        listPrice
        price
        discountPercentage
        installmentPlans {
          displayName
          name
          installments {
            discount
            fees
            number
            value
            totalValue
          }
        }
        bestInstallment {
          name
          displayName
          discount
          fees
          number
          value
          totalValue
        }
        wholesalePrices {
          price
          quantity
        }
      }
      offers {
        name
        productVariantId
        stock
        prices {
          price
          listPrice
          installmentPlans {
            displayName
            installments {
              discount
              fees
              value
              number
            }
          }
        }
      }
    }
  }`

const brandInfo = `
  productBrand {
    name
    id
    fullUrlLogo
    alias
  }`

const categoryInfo = `
  productCategories {
    active
    id
    main
    name
  }`

const promotionInfo = `
  promotions {
    content
    title
    fullStampUrl
  }`

const customizationsInfo = `
  customizations {
    customizationId
    cost
    name
    type
    values
  }`

const buyBoxInfo = `
  buyBox {
    installmentPlans {
      displayName
      installments {
        discount
        fees
        number
        value
      }
      name
    }
    maximumPrice
    minimumPrice
    quantityOffers
    sellers {
      name
    }
  }`

const similarProductsInfo = `
  similarProducts {
    alias
    image
    name
    imageUrl(w: 50, h: 50)
  }`

const allProductParams = `
  ${productInfo}
  ${attributeInfo}
  ${informationInfo}
  ${attributeSelectionInfo}
  ${brandInfo}
  ${categoryInfo}
  ${promotionInfo}
  ${customizationsInfo}
  ${buyBoxInfo}
  ${similarProductsInfo}`

export const queryProduct = `query ($productId: Long!, $partnerAccessToken: String, $attrSelection: [AttributeFilterInput]) {
  product(productId: $productId, partnerAccessToken: $partnerAccessToken) {
    ${allProductParams}
  }
}`

export const queryProductAttributeSelections = `query ($productId: Long!, $partnerAccessToken: String, $attributeId: Long!,  $value: String!) {
product(productId: $productId, partnerAccessToken: $partnerAccessToken) {
	attributeSelections(selected: { attributeId: $attributeId, value: $value } ) {
		selections {
			name
			attributeId
      displayType
			values {
				available
				selected
				value
        printUrl
			}
		}
  }
}}`

export const queryBestSellerProducts = `query ($partnerAccessToken: String, $first: Int) {
  products(partnerAccessToken: $partnerAccessToken, first: $first, sortDirection: ASC, sortKey: SALES, filters: {mainVariant:true, hasImages: true}) {
    nodes {
      ${allProductParams}
    }
    pageInfo { endCursor }
  }
}`

export const queryNewProducts = `query ($partnerAccessToken: String, $first: Int) {
  products(partnerAccessToken: $partnerAccessToken, first: $first, sortDirection: DESC, sortKey: RELEASE_DATE, filters: {mainVariant:true, hasImages: true}) {
    nodes {
      ${allProductParams}
    }
    pageInfo { endCursor }
  }
}`
