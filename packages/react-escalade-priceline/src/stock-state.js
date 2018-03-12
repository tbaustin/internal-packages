import { State } from 'statable'
import fetch from 'fetch-retry'

const endpoints = {
	production: `https://xinn7f22bj.execute-api.us-east-1.amazonaws.com/production/handler`,
	testing: `https://t9w63tqdfk.execute-api.us-east-1.amazonaws.com/staging/handler`,
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