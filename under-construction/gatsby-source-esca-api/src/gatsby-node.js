import axios from 'axios'

async function fetchProducts(options) {
	const {
		site,
		env,
		fields,
		salsify,
		skus,
		url
	} = options

	const endpoint = env === `prod`
		? `https://m570gzyn6h.execute-api.us-east-1.amazonaws.com/production/`
		: `https://7el25d5l16.execute-api.us-east-1.amazonaws.com/dev/`

	const { data } = await axios({
		method: `post`,
		url: endpoint,
		data: {
			data: {
				fields,
				salsify,
				skus: skus || `all`,
			},
			site,
			url,
		},
		headers: {
			"Content-Type": `application/json`,
		},
	})

	return data.products
}

exports.sourceNodes = async function({ actions, createNodeId, createContentDigest }, options){
	const { createNode } = actions
	try {
		const products = await fetchProducts(options)
		console.log(`Building out nodes for ${Object.keys(products).length} Esca Products`)
		for (let id in products){
			const nodeContent = {
				...products[id],
				sku: id,
			}
			const nodeMeta = {
				id: createNodeId(`escalade-products-${id}`),
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