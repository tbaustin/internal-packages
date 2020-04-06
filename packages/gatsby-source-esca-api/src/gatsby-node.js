import EscaAPIClient from '@escaladesports/esca-api-client'


async function fetchProducts(options) {
	const {
		site,
		env,
		apiKey,
		...other
	} = options

	const client = new EscaAPIClient({
		environment: env,
		site,
		apiKey,
	})

	return client.loadProducts(other)
}


export async function sourceNodes(gatsbyHelpers, pluginOptions) {
	const { actions, createNodeId, createContentDigest } = gatsbyHelpers
	const { createNode } = actions

	const formatProductNode = product => {
		const { id, sku } = product
		const nodeId = createNodeId(`escalade-products-${sku || id}`)

		const nodeMeta = {
			id: nodeId,
			parent: null,
			children: [],
			internal: {
				type: `EscaladeProduct`,
				contentDigest: createContentDigest(product),
			},
		}

		return { ...product, ...nodeMeta }
	}

	try {
		const products = await fetchProducts(pluginOptions)

		let numProducts = Object.keys(products).length
		console.log(`Building out nodes for ${numProducts} Esca Products`)

		for (let product of products) {
			let node = formatProductNode(product)
			createNode(node)
		}
	}
	catch(e) {
		console.log(`Error With Product Request: ${e}`)
		process.exit(1)
	}
}
