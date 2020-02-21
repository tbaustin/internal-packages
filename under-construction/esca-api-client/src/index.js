import dotenv from 'dotenv'
import axios from 'axios'



// --------- PROPOSED USAGE:
//
// import EscaAPIClient from 'esca-api-client'
//
// const client = new EscaAPIClient({
//   environment: `prod`,
//   site: `lifeline`
// })
//
// const products = await client.loadProducts({
//   skus: [`ABC123`, `XYZ456`]
// })
//
// -------- OR:
//
// const client = new EscaAPIClient({ site: `lifeline` })
// const products = await client.loadProducts()
//
// (above will load all Lifeline products using `/api/products/load` URL)



dotenv.config()
const apiKey = process.env.X_API_KEY
const apiKeyTest = process.env.X_API_KEY_TEST



function makeUrl(entity, action = `load`) {
  const envSuffix = this.environment === `prod` ? `` : `-test`
  const fullUrl = `https://${entity}${envSuffix}.escsportsapi.com/${action}`
  const relativeUrl = `/api/${entity}/${action}`
  return this.environment ? fullUrl : relativeUrl
}



async function loadProducts(params) {
	const { fields, salsify, skus } = params

	const { data } = await axios({
		method: `post`,
		url: this.endpoints.products,
		data: {
			fields,
			salsify,
			skus: skus || (this.site ? [`all`] : [])
		},
		headers: {
      "Content-Type": `application/json`,
			...this.site ? { "ESC-API-Context": this.site } : {},
			...this.apiKey ? { "X-API-Key": this.apiKey } : {},
		},
	})

  const errorObject = {
    error: `Something went wrong with the request: ${data}`
  }

  return data.products ? data : errorObject
}



export default function EscaAPIClient(config) {
  const { environment, endpoints, site } = config || {}

  // Set properties from config
  this.apiKey = environment === `prod` ? apiKey : apiKeyTest
  this.environment = environment
  this.site = site

  // Bind functions declared above as methods
  this.makeUrl = makeUrl.bind(this)
  this.loadProducts = loadProducts.bind(this)

  // Set up default endpoints
  this.endpoints = {
    products: this.makeUrl(`products`),
    inventory: this.makeUrl(`inventory`),
    pricing: this.makeUrl(`pricing`)
  }

  // Set any custom endpoints defined in config
  for (let type in endpoints) {
    let endpoint = endpoints[type]
    if (endpoint) this.endpoints[type] = endpoint
  }
}
