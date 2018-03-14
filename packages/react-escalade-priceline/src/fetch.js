import fetch from 'fetch-retry'

async function fetchMethod(options){
	if (!options.site) {
		console.log(`Warning: No site option set.`)
	}
	let ids = []
	if(options.ids){
		ids.push(...options.ids)
	}
	if(options.id){
		ids.push(options.id)
	}
	let res = await fetch(options.endpoint, {
		method: 'POST',
		body: JSON.stringify({
			site: options.site,
			ids,
		})
	})
	res = await res.json()
	this.setState(res)
}
export default fetchMethod