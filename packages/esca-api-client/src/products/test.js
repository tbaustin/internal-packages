import EscaAPIClient from '../index'


const client = new EscaAPIClient({
	environment: TEST_API_ENV,
	site: `lifeline`,
	apiKey: TEST_API_KEY,
})


test(`Loads Lifeline products`, async () => {
	expect.assertions(4)

	const options = {
		fields: [`inventory`, `price`],
		skus: [`2-FMT-3`, `2-FMT-5`]
	}

	const variants = await client.loadProducts(options)
	expect(variants).toBeInstanceOf(Array)
	expect(variants).toHaveLength(2)

	const baseProducts = await client.loadProducts({
		...options, byParent: true
	})
	expect(baseProducts).toBeInstanceOf(Array)
	expect(baseProducts).toHaveLength(1)
})
