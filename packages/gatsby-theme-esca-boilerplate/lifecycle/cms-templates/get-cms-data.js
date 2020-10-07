const fs = require(`fs`)
const util = require(`util`)
const readFile = util.promisify(fs.readFile)


/**
 * Gets Schema & all needed data from Sanity to build out template-based pages
 */
module.exports = async function getCMSData(graphql) {
	const query = await readFile(`${__dirname}/query.graphql`, `utf8`)
	const res = await graphql(query)

	if (res.errors) {
		console.error(res.errors)
		process.exit(1)
	}

	const { data } = res || {}
	const {
		sanityPersistedSchema,
		allCategory,
		allBaseProduct,
		allSanityTemplate,
	} = data || {}

	const { nodes: categories } = allCategory || {}
	const { nodes: fullProducts } = allBaseProduct || {}
	const { nodes: templates } = allSanityTemplate || {}

	const { json: schemaJson } = sanityPersistedSchema || {}
	const schema = JSON.parse(schemaJson)

	/**
   * Concatenate together the "data sources" for templates
   * i.e. types that are "hooked up" to templates
   */
	const dataSources = [...categories, ...fullProducts]

	return { schema, dataSources, templates }
}
