import { formatImageUrl } from "../utils/Util"

export function ParseBannerToMultipleImageBanner(banners, props) {
	const { mode, id, ...rest } = props

	const images = banners.map(banner => {
		return {
			...rest,
			imageUrl: formatImageUrl(banner.bannerUrl),
			action: {
				type: 'path',
				value: banner.urlOnClick || null,
				title: banner.title || null
			}
		}
	})

	return {
		id: banners[0].id || id || '',
		name: 'MultipleImageBanner',
		data: {
			mode: mode,
			images
		}
	}
}

export function ParseProductToMultipleImageBanner(product, props) {
	const { mode, id, ...rest } = props

	const _images = product.images.map(image => {
		return {
			imageUrl: formatImageUrl(image.url),
			action: {
				type: 'path',
				value: image.urlOnClick || null,
				title: image.title || null
			}
		}
	})

	return {
		id: product.id || id || '',
		name: 'MultipleImageBanner',
		data: {
			mode: mode,
			...product,
			...props,
			images: _images
		}
	}
}

export function ParseContentToBasicText(contents, props) {
	const { id, ...rest } = props

	let response = []
	for (const content of contents) {
		let contentData = {
			content: content.content,
			contentId: content.contentId,
			title: {
				content: content.title
			}
		}

		response.push({
			id: content.id || id || '',
			name: 'BasicText',
			data: {
				...contentData,
				...rest
			}
		})
	}

	return response
}

export function ParseProductsToDirectProductShelf(products, props) {
	const { mode, title, isLoading, gap, searchParams, ...rest } = props

	let tempId = new Date().getTime()
	let formatedProducts = []
	for (const product of products) {
		let categoryNames = []
		let categoryIds = []
		if (product.productCategories.length > 0) {
			const activeCategories = product.productCategories.filter(c => c.active)
			categoryNames = activeCategories?.length > 0 ? activeCategories.map(c => c.name) : []
			categoryIds = activeCategories?.length > 0 ? activeCategories.map(c => c.id) : []
		}

		if (product.images?.length > 0) {
			product.images = product.images.map((img, idx) => {
				tempId++
				return {
					imageId: `img${tempId}`,
					imageUrl: formatImageUrl(img.url)
				}
			})
		}

		// formatedProducts.push(contentProduct)
	}

	const componentData = {
		id: tempId++,
		name: 'DirectProductShelf',
		data: {
			...rest,
			mode: mode,
			title: title,
			isLoading: isLoading || false,
			gap: gap,
			searchParams: searchParams,
			products: formatedProducts
		}
	}

	return componentData
}
