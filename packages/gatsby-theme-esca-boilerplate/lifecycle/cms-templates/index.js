const TemplateEngine = require(`@escaladesports/sanity-template-engine`).default
// const { resolve } = require(`path`)
const templateComponent = require.resolve(`./../../src/main-template.js`)
const getCMSData = require(`./get-cms-data`)
const getProductLists = require(`./get-product-lists`)


/**
 * Creates a page for every data source that's "hooked up" to a template in CMS
 */
exports.createPages = async ({ actions, graphql }) => {
	const { createPage } = actions

	// Get everything needed from Sanity & instantiate template engine w/ schema
	const { dataSources, templates, schema } = await getCMSData(graphql)
	const engine = TemplateEngine({ schema })

	// Products are lumped in w/ other data sources; extract them for use below
	const allProducts = dataSources.filter(s => s._type === `baseProduct`)

	// Create a page for each data source
	dataSources.forEach((source, idx) => {
		// Find the correct template to use for this data source
		const { template } = source || {}
		const { _id: currentTemplateId } = template || {}
		const cmsTemplate = templates.find(t => t._id === currentTemplateId)

		// Get the fields & content structure for the template found above
		const {
			title,
			path,
			breadcrumbs,
			_rawContent: content,
			tagManagerEvent
		} = cmsTemplate || {}

		/**
		 * Get product IDs needed for any instances of ProductListWidget that are
		 * present in the template's content
		 */
		const {
			productLists,	// Lists of IDs organized by _key of each instance
			allProductIds	// List of all IDs used across all instances
		} = getProductLists({
			templateEngine: engine,
			dataSource: source,
			allProducts,
			content
		})

		if (path) {
			// Replace template variables in path w/ actual values
			const parsedPath = engine.parse(path, source)

			createPage({
				path: parsedPath,
				component: templateComponent,
				context: {
					title,
					breadcrumbs,
					content,
					tagManagerEvent,
					dataSource: source,
					productLists,
					allProductIds
				},
			})
		}
	})
}
