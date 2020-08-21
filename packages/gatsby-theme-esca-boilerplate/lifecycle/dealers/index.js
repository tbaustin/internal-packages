const dirs = require(`@escaladesports/boilerplate/dirs`)
const { escaladeSite } = require(`${dirs.site}/config`)
const axios = require(`axios`)

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
	const { createNode } = actions

	let allDealers = []
	let curPage = 0

	async function getDealers(page) {
		const url = `https://m570gzyn6h.execute-api.us-east-1.amazonaws.com/production/`
		const { data } = await axios({ 
			method: `POST`, 
			url, 
			data: {
				url: `https://dealers.escsportsapi.com/all`,
				site: `goalrilla`,
				reqHeaders: { 'Get-Page': page },
			},
		})
  
		const { pages, dealers } = data

		allDealers = [...allDealers, ...dealers]

		if(curPage < pages){
			curPage++
			await getDealers(curPage)
		}
	}
  
	await getDealers(curPage)

	allDealers.forEach(dealer => {
		const nodeContent = JSON.stringify(dealer)

		const nodeMeta = {
			id: createNodeId(`my-data-${dealer.id}`),
			parent: null,
			children: [],
			internal: {
				type: `Dealers`,
				mediaType: `text/html`,
				content: nodeContent,
				contentDigest: createContentDigest(dealer),
			},
		}

		const node = Object.assign({}, dealer, nodeMeta)
		createNode(node)
	})
} 