import EscaAPIClient from '@escaladesports/esca-api-client'

export default async function productRequest(options) {
	const {
		site,
		env,
		fields,
		salsify,
		skus,
	} = options

	const client = new EscaAPIClient({
		environment: env,
		site,
	})

	const products = await client.loadProducts({
		fields,
		salsify,
		skus
	})

	return products
}

