const fs = require(`fs`)
const util = require(`util`)
const readFile = util.promisify(fs.readFile)
const getData = require(`./get-data`)



exports.sourceNodes = async (gatsbyHelpers) => {
	const { actions, createNodeId, createContentDigest } = gatsbyHelpers
	const { createNode } = actions

	const { products, categories } = await getData()

	for (let product of products) {
		createNode({
			...product,
			id: createNodeId(product._id),
			internal: {
				type: `BaseProduct`,
				contentDigest: createContentDigest(product),
			},
		})
	}

	for (let category of categories) {
		createNode({
			...category,
			id: createNodeId(category._id),
			internal: {
				type: `Category`,
				contentDigest: createContentDigest(category),
			},
		})
	}
}


exports.createSchemaCustomization = async ({ actions }) => {
	const { createTypes } = actions
	const typeDefs = await readFile(`${__dirname}/type-defs.graphql`, `utf8`)
	createTypes(typeDefs)
}


exports.createResolvers = ({ createResolvers }) => {
	const productResolver = {
		salsify: {
			resolve: source => JSON.parse(source.salsify || `{}`),
		},
		customFieldEntries: {
			resolve: source => JSON.parse(source.customFieldEntries || `[]`),
		},
	}

	createResolvers({
		BaseProduct: productResolver,
		Variant: productResolver,
	})
}
