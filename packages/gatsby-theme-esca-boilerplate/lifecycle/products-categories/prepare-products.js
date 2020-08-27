const { combineArrays } = require(`@escaladesports/utils`)
const _pick = require(`lodash/pick`)
const _omit = require(`lodash/omit`)



const prepareVariants = options => {
	const { cmsVariants, apiVariants, salsifyProperties, reviews } = options

	const combined = combineArrays(`sku`, cmsVariants, apiVariants)

	return combined.map(variant => {
		const { customFieldEntries = [], ...other } = variant
		const { sku } = other

		const variantReviews = reviews.filter(review => {
			const { details } = review || {}
			const { product_page_id } = details || {}
			if (!product_page_id) return false
			return sku.toLowerCase() === product_page_id.toLowerCase()
		})

		const sumOfRatings = variantReviews.reduce((sum, review) => {
			const { metrics } = review || {}
			const { rating } = metrics || {}
			return sum + rating || sum
		}, 0)

		const averageRating = (sumOfRatings / variantReviews.length) || 0

		const salsify = _pick(other, salsifyProperties)
		const nonSalsify = _omit(other, salsifyProperties)

		return {
			...nonSalsify,
			rating: averageRating,
			customFieldEntries: JSON.stringify(customFieldEntries),
			salsify: JSON.stringify(salsify),
		}
	})
}



module.exports = async function prepareProducts(options) {
	const {
		cmsProducts,
		apiProducts,
		salsifyProperties,
		categories,
		reviews,
	} = options

	const combined = combineArrays(`sku`, cmsProducts, apiProducts)
		.filter(p => p._id) // Filter out products not in CMS

	return combined.map(product => {
		const {
			variants,
			cmsVariants,
			categories: basicCategories = [], // These do not have ancestry
			customFieldEntries = [],
			...allOtherFields
		} = product

		// Add full ancestry array to each of the product's categories
		const fullCategories = basicCategories.map(basicCategory => {
			return categories.find(c => c._id === basicCategory._ref)
		})

		const fullVariants = prepareVariants({
			reviews,
			apiVariants: variants,
			cmsVariants,
			salsifyProperties,
		})

		const salsify = _pick(allOtherFields, salsifyProperties)
		const nonSalsify = _omit(allOtherFields, salsifyProperties)

		return {
			...nonSalsify,
			categories: fullCategories,
			variants: fullVariants,
			customFieldEntries: JSON.stringify(customFieldEntries),
			salsify: JSON.stringify(salsify),
		}
	})
}
