import EscaAPIClient from '@escaladesports/esca-api-client'

export default async (options) => {
	const {
		site,
		env = `prod`,
		fields = [],
		salsify = [],
		groupby = true,
		skus = `all`,
		apiKey,
	} = options
  
	const client = new EscaAPIClient({
		environment: env,      // 'test' or 'prod'; defaults to 'test'
		site,                 // site name; same as ESC-API-Context header
		apiKey: process.env[env === `prod` ? `X_API_KEY` : `X_API_KEY_TEST`] || apiKey,           // optional; uses relative URLs if not given
	})

	const products = await client.loadProducts({
		fields, // optional; returns name & sku by default
		skus,   // optional; defaults to 'all'
		byParent: groupby,  // optional; groups variants by base product
		salsify,
		returnAsObject: true,
	})

	if (products) {
		return products
	} 
}

