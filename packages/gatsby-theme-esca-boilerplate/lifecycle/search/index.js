const lunr  = require(`lunr`)
const { readFile, outputJson } = require(`fs-extra`)
const TemplateEngine = require(`@escaladesports/sanity-template-engine`).default


exports.createPages = async function({ graphql }){
	// Query data to be indexed
	const query = await readFile(`${__dirname}/query.graphql`, `utf8`)
	const { data } = await graphql(query)

	const {
		allBaseProduct: { nodes },
		sanityPersistedSchema: { json },
	} = data

	const engine = TemplateEngine({ schema: JSON.parse(json) })

	const itemStore = {}

	const searchData = nodes.reduce((acc, cur) => {
		const { variants, template, _id } = cur
		const path = template && template.path
		let parsedPath = path && engine.parse(path, cur)

		if(parsedPath){
			const datum = {
				id: _id,
				index: {
					path: parsedPath,
					sku: cur.sku,
					categories: cur.categories && cur.categories.reduce((acc, { ancestry }) => {
						const catSearchTerms = ancestry ? ancestry.map(({ name }) => name) : []
						return [...acc, ...catSearchTerms]
					}, []),
					variants: variants && variants.reduce((acc, v) => {
						const { sku, slug } = v

						return [...acc, sku || ``, slug ? slug.current : ``]
					}, []),
					slug: cur.slug ? cur.slug.current : cur.sku,
				},
				store: {
					path: parsedPath,
					...(cur || {}),
				},
			}

			acc.push(datum)

			// if(variants) {
			// 	variants.forEach(v => {
			// 		const vDatum = {
			// 			id: v._id,
			// 			index: {
			// 				path: parsedPath,
			// 				salsify: v.salsify,
			// 				customFieldEntries: v.customFieldEntries,
			// 				price: v.price,
			// 				sku: v.sku,
			// 				type: v._type,
			// 				slug: cur.slug ? cur.slug.current : cur.sku,
			// 			},
			// 			store: {
			// 				path: parsedPath,
			// 				...(v || {}),
			// 			},
			// 		}

			// 		acc.push(vDatum)
			// 	})
			// }
		}

		return acc
	}, [])

	// Create index
	const index = lunr(function(){
		this.ref(`id`) // lunr uses this as the identifier
		if(searchData.length && searchData[0]){
			for(let i in searchData[0].index){
				this.field(i) // fields that lunar will search
			}
		}

		searchData.forEach(({ id, index, store }) => {
			this.add({
				id,
				...index,
			})
			itemStore[id] = store
		})
	})

	await outputJson(`./public/search-index.json`, {
		index,
		store: itemStore,
	})

}

// Dynamic routing
exports.onCreatePage = async function({ page, actions: { createPage } }){
	if (page.path.match(/^\/search/)) {
		page.matchPath = `/search/*`
		createPage(page)
	}
}
