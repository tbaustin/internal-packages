import EscaAPIClient from '@escaladesports/esca-api-client'

async function fetchProducts(options) {
	const {
		site,
		env,
		fields,
		salsify,
		skus,
		apiKey
	} = options

	const client = new EscaAPIClient({
		environment: env,
		site,
		apiKey
	})

	const products = await client.loadProducts({
		fields,
		salsify,
		skus
	})

	return products
}

exports.sourceNodes = async function({ actions, createNodeId, createContentDigest }, options){
	const { createNode } = actions
	try {
		const products = await fetchProducts(options)
		console.log(`Building out nodes for ${Object.keys(products).length} Esca Products`)
		for (let product of products){
			const nodeContent = { ...product }
			const nodeMeta = {
				id: createNodeId(`escalade-products-${product.sku || product.id}`),
				parent: null,
				children: [],
				internal: {
					type: `EscaladeProducts`,
					content: JSON.stringify(nodeContent),
					contentDigest: createContentDigest(nodeContent),
				},
			}
			const node = {
				...nodeContent,
				...nodeMeta,
			}
			createNode(node)
		}
	} catch(e){
		console.log(`Error With Product Request: ${e}`)
		process.exit(1)
	}

}