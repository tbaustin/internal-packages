import EscaAPIClient from '@escaladesports/esca-api-client'

let client = null

export default async function productRequest(options) {
	const {
		site,
		env,
		fields,
		salsify,
		skus,
	} = options

	if (!client) {
		client = new EscaAPIClient({
			environment: env,
			site,
		})
	}

	return await client.loadProducts({
		fields,
		salsify,
		skus,
	})
}

