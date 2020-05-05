import EscaAPIClient from '../index'


const client = new EscaAPIClient({
	environment: process.env.ENV,
	apiKey: process.env.API_KEY,
})


test(`Calculates taxes for an order`, async () => {
	expect.assertions(1)

	const expected = {
		"label": `California Sales Tax`,
	}


	const taxes = await client.calclateTaxs({
		"state": `CA`,
		"subtotal": 50.01,
		"shipping": 10.50,
		"discounts": 5.00,
	})

	console.log(JSON.stringify(taxes, null, 2))
	console.log(taxes.value)
	expect(taxes).toMatchObject(expected)
})
