import EscaAPIClient from '../index'


const client = new EscaAPIClient({
	environment: process.env.ENV,
	site: `rocket`,
	apiKey: process.env.API_KEY,
	taxService: `sovos`, 
})


test(`Calculates taxes for an order`, async () => {
	expect.assertions(1)

	const expected = {
		label: `CA County Tax`,
	}


	const taxes = await client.calculateTaxes({
		src: `WEB`,
		action: `create`,
		trans_id: `CW006177-D`,
		order: {
			order_id: `CW006177-D`,
			warehouse: `sandiego`,
			ship_street1: `163 Oakland Ave.`,
			ship_city: `Sacramento`,
			ship_state: `CA`,
			ship_zip: `95828`,
			ship_country: `US`,
			bill_street1: `163 Oakland Ave.`,
			bill_city: `Sacramento`,
			bill_state: `CA`,
			bill_zip: `95828`,
			bill_country: `US`,
			products: {
				T1265: {
					qty: `5`,
					price: `69.99`,
				},
			},
			shipping: `50.30`,
			discounts: {
				"10OFF": `-5.12`,
			},
			duties: 20,
			total: 395.13,
		},
	})

	expect(taxes).toMatchObject(expected)
})
