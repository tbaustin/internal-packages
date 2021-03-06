import EscaAPIClient from '../index'


const client = new EscaAPIClient({
	environment: TEST_API_ENV,
	site: `goalrilla`,
	apiKey: TEST_API_KEY,
})


// These shipping endpoints like to take longer than 5 seconds...
jest.setTimeout(30000)


test(`Generates shipping quote for a Goalrilla item`, async () => {
	expect.assertions(1)

	const expected = {
		"evansville": {
			"options": {},
		},
	}


	const quote = await client.loadShipping({
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

	// console.log(JSON.stringify(quote, null, 2))
	expect(quote).toMatchObject(expected)
})
