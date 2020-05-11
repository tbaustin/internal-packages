import EscaAPIClient from '@escaladesports/esca-api-client'

let client = null

/**
 * Fetch products from the API, instantiating the API client only once
 */
export default async function productRequest(options) {
	const {
		site,
		env,
		fields,
		salsify,
		skus,
		endpoints,
	} = options

	// Instantiate the client only once
	if (!client) {
		client = new EscaAPIClient({
			environment: env,
			site,
			endpoints,
		})
	}

	return client.loadProducts({
		fields,
		salsify,
		skus,
	})
}
