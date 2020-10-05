
/**
 * Creates 2 things:
 *
 *   productLists:  A hashmap where each key is the _key property of a
 *                  ProductListWidget instance and the value is an array of SKUs
 *                  for products that should be loaded for that instance
 *                  (filtered by the widget's category)
 *
 *  allProductIds:  An array of all product SKUs represented above
 *
 */
module.exports = function getProductLists(options) {
	const { content, dataSource, allProducts, templateEngine } = options

	const getFilteredProducts = block => {
		const { categorySources, limit, productListSources } = block || {}
		/**
     * Use either the manually-chosen product list or one inferred from template
     * variable settings
     */
		if(productListSources) {
			const {
				productList: manualProductList,
				templateVariable: plTempVar,
				useTemplateDataSource: plUseTempDataSource,
			} = productListSources || {}

			let productList = manualProductList || []

			if(templateEngine && dataSource){
				productList = plUseTempDataSource
					? dataSource
					: plTempVar
						? templateEngine.resolveProperty(
							plTempVar,
							dataSource,
						)
						: []
			}

			const filtered = allProducts.filter(product => {
				const { _id } = product

				return (productList || []).find(productItem => productItem._id === _id)
			})

			const skus = filtered.map(p => (p || {}).sku)
			return limit ? skus.slice(0, limit) : skus
		}



		const {
			category: manualCategory,
			templateVariable,
			useTemplateDataSource,
		} = categorySources || {}

		/**
     * Use either the manually-chosen category or one inferred from template
     * variable settings
     */
		let category = manualCategory
		if (templateEngine && dataSource) {
			category = useTemplateDataSource
				? dataSource
				: templateEngine.resolveProperty(
					templateVariable,
					dataSource,
				)
		}

		// Use the slug as identifier for filtering
		const { slug: categorySlug } = category || {}
		const { current: slugValue } = categorySlug || {}

		// Filter down to products containing the category
		const filtered = allProducts.filter(product => {
			const { categories } = product || {}

			return (categories || []).find(c =>  {
				const { slug } = c || {}
				const { current } = slug || {}
				return current === slugValue
			})
		})

		const skus = filtered.map(p => (p || {}).sku)
		return limit ? skus.slice(0, limit) : skus
	}

	// Start the hashmap of product lists
	const productLists = {}

	/**
   * Traverse the tree of blocks, add product list for each widget found at a
   * property corresponding to its _key
   */
	const getListForBlock = block => {
		if (block._type === `ProductListWidget`) {
			productLists[block._key] = getFilteredProducts(block)
		}
		if (block.content && block.content.length && Array.isArray(block.content)) {
			block.content.forEach(getListForBlock)
		}
	}
	if (content) content.forEach(getListForBlock)

	// Join together all product IDs into one big array & remove duplicates
	const allProductIds = [
		...new Set(
			Array().concat(
				...Object.values(productLists),
			),
		),
	]

	return { productLists, allProductIds }
}
