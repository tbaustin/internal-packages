import 'core-js'
import 'regenerator-runtime/runtime'
import apiRequest from './api-request'
import loadProducts from './load-products'



function makeUrl(entity, action = `load`) {
	const envSuffix = this.environment === `prod` ? `` : `-test`
	const fullUrl = `https://${entity}${envSuffix}.escsportsapi.com/${action}`
	const relativeUrl = `${this.devHost}/api/${entity}/${action}`
	return this.apiKey ? fullUrl : relativeUrl
}



export default class EscaAPIClient {
	constructor(config) {
		const {
			environment,
			endpoints,
			site,
			apiKey,
			devHost,
		} = config || {}

		// Set properties from config
		this.apiKey = apiKey
		this.environment = environment
		this.site = site
		this.devHost = devHost

		// Bind functions declared above as methods
		this.makeUrl = makeUrl.bind(this)
		this.apiRequest = apiRequest.bind(this)
		this.loadProducts = loadProducts.bind(this)

		// Set up default endpoints
		this.endpoints = {
			products: this.makeUrl(`products`),
			inventory: this.makeUrl(`taxes`),
			pricing: this.makeUrl(`shipping`),
		}

		// Set any custom endpoints defined in config
		for (let type in endpoints) {
			let endpoint = endpoints[type]
			// Don't use if the key is set but value is falsey
			if (endpoint) this.endpoints[type] = endpoint
		}
	}


	get headers() {
		return {
			"Content-Type": `application/json`,
			...this.site ? { "ESC-API-Context": this.site } : {},
			...this.apiKey ? { "X-API-Key": this.apiKey } : {},
		}
	}
}
