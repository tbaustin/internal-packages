import EscaAPIClient from '../index'


const client = new EscaAPIClient({
	environment: process.env.ENV,
	site: `goalrilla`,
	apiKey: process.env.API_KEY,
})


test(`Loads Lifeline products`, async () => {
	expect.assertions(1)

	const expected = {
		"evansville": {
			"options": {},
		},
	}


	const quote = await client.shippingQuote({
		"destination":{
			"first_name": `Test`,
			"last_name": `Order`,
			"street1": `3 HOPEWELL SHORES`,
			"street2": ``,
			"city": `WOLFEBORO`,
			"state": `nh`,
			"zip": `03894`,
			"phone": `8642884765`,
			"email": `jgray@escaladesports.com`,
			"country": `US`,
		},
		"products":{
			"B1002":{},
		},
	})

	console.log(JSON.stringify(quote, null, 2))
	expect(quote).toMatchObject(expected)
})
