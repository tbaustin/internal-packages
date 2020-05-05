import EscaAPIClient from '../index'


const client = new EscaAPIClient({
	environment: process.env.ENV,
	site: `lifeline`,
	apiKey: process.env.API_KEY,
})


test(`Loads Lifeline products`, async () => {
	expect.assertions(2)

	const products = await client.loadProducts({
		fields: [`inventory`, `price`],
		skus: [`2-FMT-3`, `2-FMT-5`],
	})

	// console.log(JSON.stringify(products, null, 2))
	expect(products).toBeInstanceOf(Array)
	expect(products).toHaveLength(2)
})
