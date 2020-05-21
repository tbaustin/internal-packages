import EscaAPIClient from '../index'


const client = new EscaAPIClient({
	environment: process.env.ENV,
	site: `pingpong`,
	apiKey: process.env.API_KEY,
})


test(`Get a new order id`, async () => {
	expect.assertions(1)
	const orderId = await client.getOrderId()
	expect(orderId).toBeTruthy()
})

test(`Load an existing order`, async () => {
	expect.assertions(1)

	const expected = [		
		{oid: 50509},
		{oid: 50512},
	]
	const order = await client.loadOrder({
		order_id: [
			`ST050509-T`,`ST050512-T`,
		],
	})

	expect(order).toMatchObject(expected)
})

test(`Store an order`, async () => {
	expect.assertions(1)

	const expected = {
		order_id: [
			{
				evansville: `PP050863-T`,
			},
		],
	}
	const order = await client.storeOrder({
		email: `customer@email.com`,
		delivery: {
			first_name: `David`,
			last_name: `Roth`,
			company: `Van Halen`,
			street1: `20 Maple Dr.`,
			street2: ``,
			city: `San Pedro`,
			state: `CA`,
			zip: `90731`,
			country: `US`,
			phone: `3216549870`,
		},
		billing: `delivery`,
		locations: {
			evansville: {
				order_id: `PP050863-T`,
				products: {
					T1265: {
						length: 12,
						width: 7.25,
						height: 2.76,
						weight: 1.98,
						fc: 85,
						price: 39.99,
						qty: 1,
					},
				},
				shipping: {
					options: {
						29.14: {
							label: `UPS 2nd Day Air`,
							value: 29.14,
						},
					},
					skus: [
						`T1265`,
					],
					service: `ups`,
				},
				discounts: {
					"10OFF": 4,
				},
				taxes: {
					id: `12345`,
					value: 3.52,
				},
			},
		},
	})

	console.log(order)
	expect(order).toMatchObject(expected)
})