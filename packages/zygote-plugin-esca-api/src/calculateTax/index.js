export const calculateTax = async (data) => {

	console.log(`calculateTax`, data)
	return {
		id: `tax`,
		description: `Michigan Tax`,
		value: parseInt(10),
	}
}
// import EscaAPIClient from '@escaladesports/esca-api-client'

// const calculateTax = async ({ shippingAddress, shipping, subtotal, discount }) => {

// 	console.log(`Calculate Tax`)
// 	const client = new EscaAPIClient()
// 	const tax = await client.calculateTaxes(
// 		{
// 			"src": `WEB`,
// 			"action": `create`,
// 			"trans_id": `CW006177-D`,
// 			"order": {
// 				"order_id": `CW006177-D`,
// 				"customer_number": 19000,
// 				"warehouse": `sandiego`,
// 				"ship_street1": `163 Oakland Ave.`,
// 				"ship_city": `Sacramento`,
// 				"ship_state": `CA`,
// 				"ship_zip": `95828`,
// 				"ship_country": `US`,
// 				"bill_street1": `163 Oakland Ave.`,
// 				"bill_city": `Sacramento`,
// 				"bill_state": `CA`,
// 				"bill_zip": `95828`,
// 				"bill_country": `US`,
// 				"products": {
// 					"T1265": {
// 						"qty": `5`,
// 						"price": `69.99`,
// 					},
// 				},
// 				"shipping": `50.30`,
// 				"discounts": [
// 					`-5.12`,
// 				],
// 				"duties": 20,
// 				"total": 395.13,
// 			},
// 		})
// }


// export { calculateTax }