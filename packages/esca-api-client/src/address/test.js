import EscaAPIClient from '../index'


const client = new EscaAPIClient({
	environment: TEST_API_ENV,
	site: `goalrilla`,
	apiKey: TEST_API_KEY,
})


// These shipping endpoints like to take longer than 5 seconds...
jest.setTimeout(30000)


test(`Validate address`, async () => {
	expect.assertions(1)

	const expected = {
		"valid": true
	}


	const quote = await client.validateAddress({
		"address": {
			"street1":"817 Maxwell Ave",
			"street2":"",
			"city":"Evansville",
			"state":"IN",
			"zip":"47711",
			"phone":"5555555555",
			"email":"test@gmail.com",
			"country":"US"
		},
	})

	// console.log(JSON.stringify(quote, null, 2))
	expect(quote).toMatchObject(expected)
})
