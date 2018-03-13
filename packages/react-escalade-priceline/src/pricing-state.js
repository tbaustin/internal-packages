import { State } from 'statable'
import fetch from 'fetch-retry'

const endpoints = {
	production: `https://cojn6cbcd7.execute-api.us-east-1.amazonaws.com/production/handler`,
	testing: `https://hmfnvefe14.execute-api.us-east-1.amazonaws.com/staging/handler`,
}

export default new State({}, {
	async fetch(options){
		options = {
			env: `production`,
			...options
		}
		if(!options.endpoint){
			options.endpoint = endpoints[options.env]
		}
		if(!options.site){
			console.log(`Warning: No site option set.`)
		}
		let ids = options.ids
		if(typeof ids !== 'object'){
			ids = [ ids ]
		}
		console.log('Fetching pricing...')
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
})