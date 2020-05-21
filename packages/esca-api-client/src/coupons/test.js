import EscaAPIClient from '../index'


const client = new EscaAPIClient({
	environment: TEST_API_ENV,
	site: `vuly`,
	apiKey: TEST_API_KEY,
})


test(`Load the coupon data`, async () => {
	expect.assertions(1)

	const expected = {
		"code": `10OFF`,
		"type": `discount`,
	}


	const coupon = await client.loadCoupon({
		"code":`10off`,
	})

	expect(coupon).toMatchObject(expected)
})

// test(`Calculates the order discount from a coupon`, async () => {
// 	expect.assertions(1)

// 	const expected = {
// 		"valid": true,
// 	}


// 	const discount = await client.calculateDiscount({
// 		"code": `10off`,
// 		"order": {
// 			"email": `merzikain@yahoo.com`,
// 			"delivery": {
// 				"first_name": `Jason`,
// 				"last_name": `Gray`,
// 				"company": ``,
// 				"street1": `817 Maxwell Ave.`,
// 				"street2": ``,
// 				"city": `Evansville`,
// 				"state": `IN`,
// 				"zip": `47711`,
// 				"country": `US`,
// 				"phone": ``,
// 			},
// 			"billing": `delivery`,
// 			"products": {
// 				"BSWFS1": {
// 					"qty": 1,
// 				},
// 			},
// 		},
// 	})

// 	expect(discount).toMatchObject(expected)
// })


test(`Validates a coupon`, async () => {
	expect.assertions(1)

	const expected = {
		"valid": true,
	}
	const coupon = await client.validateCoupon({
		"code": `10off`,
	})

	expect(coupon).toMatchObject(expected)
})
