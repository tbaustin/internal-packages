const fs = require(`fs`)
const util = require(`util`)
const readFile = util.promisify(fs.readFile)
const template = require.resolve(`./../../src/main-template.js`)
const getProductLists = require(`./../cms-templates/get-product-lists`)


/**
 * Creates an individual page for each custom page defined in the CMS
 */
exports.createPages = async ({ actions, graphql }) => {
	const { createPage } = actions

	const query = await readFile(`${__dirname}/query.graphql`, `utf8`)
	const res = await graphql(query)

	if (res.errors) {
		console.error(res.errors)
		process.exit(1)
	}

	const { data } = res || {}
	const { allBaseProduct, allSanityPage } = data || {}
	const { nodes: allProducts } = allBaseProduct || {}
	const { nodes: pages } = allSanityPage || {}

	// Create each page defined in the CMS
	pages.forEach((page, idx) => {
		const {
			title,
			path,
			breadcrumbs,
			_rawContent: content,
      tagManagerEvent,
      schemaOrgPageType,
      schemaOrgEnabled
		} = page || {}

		/**
		 * Get product IDs needed for any instances of ProductListWidget that are
		 * present in the page's content
		 */
		const {
			productLists,	// Lists of IDs organized by _key of each instance
			allProductIds	// List of all IDs used across all instances
		} = getProductLists({ allProducts, content })

		path && createPage({
			path,
			component: template,
			context: {
				title,
				breadcrumbs,
				content,
				productLists,
				allProductIds,
        tagManagerEvent,
        schemaOrgPageType,
        schemaOrgEnabled
			}
		})
	})
}
