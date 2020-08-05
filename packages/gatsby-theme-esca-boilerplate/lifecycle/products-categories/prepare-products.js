const { combineArrays } = require(`@escaladesports/utils`)
const _pick = require(`lodash/pick`)
const _omit = require(`lodash/omit`)



const prepareVariants = options => {
	const { cmsVariants, apiVariants, salsifyProperties } = options

	const combined = combineArrays(`sku`, cmsVariants, apiVariants)

	return combined.map(variant => {
		const { customFieldEntries = [], ...other } = variant

		const salsify = _pick(other, salsifyProperties)
		const nonSalsify = _omit(other, salsifyProperties)

		return {
			...nonSalsify,
			customFieldEntries: JSON.stringify(customFieldEntries),
			salsify: JSON.stringify(salsify)
		}
	})
}



module.exports = async function prepareProducts(options) {
	const {
		cmsProducts,
		apiProducts,
		salsifyProperties,
		categories
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
			apiVariants: variants,
			cmsVariants,
			salsifyProperties
		})

		const salsify = _pick(allOtherFields, salsifyProperties)
		const nonSalsify = _omit(allOtherFields, salsifyProperties)

		return {
			...nonSalsify,
			categories: fullCategories,
			variants: fullVariants,
			customFieldEntries: JSON.stringify(customFieldEntries),
			salsify: JSON.stringify(salsify)
		}
	})
}
