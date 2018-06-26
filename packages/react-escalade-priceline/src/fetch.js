import fetch from 'isomorphic-fetch'

async function fetchMethod(options) {
	if (!options.site) {
		console.log(`Warning: No site option set.`)
	}
	let ids = []
	if (options.ids) {
		ids.push(...options.ids)
	}
	if (options.id) {
		ids.push(options.id)
	}
	if (!ids.length) {
		return
	}
	// Fetch data
	let body = JSON.stringify({
		site: options.site,
		skus: ids,
	})
	let res = await fetch(options.endpoint, {
		method: 'POST',
		body,
	})
	res = await res.json()
	if (`inventory` in res) {
		res = extractStock(res)
	}
	if(`prices` in res){
		res = extractPrices(res)
	}
	this.setState(res)

	// Repoll interval
	if (typeof window === 'object') {
		clearTimeout(this.timeout)
		this.timeout = setTimeout(() => {
			this.fetch({
				...options,
				ids: Object.keys(this.state)
			})
		}, 60 * 1000)
	}
}

function extractStock(res) {
	let newRes = {}
	res = res.inventory
	for (let i in res) {
		newRes[i.toLowerCase()] = res[i].stock
	}
	return newRes
}
function extractPrices(res) {
	let newRes = {}
	res = res.prices
	for (let i in res) {
		newRes[i.toLowerCase()] = Number(res[i].price)
	}
	return newRes
}

export default fetchMethod
