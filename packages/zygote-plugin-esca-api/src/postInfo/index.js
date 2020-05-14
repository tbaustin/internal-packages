import EscaAPIClient from '@escaladesports/esca-api-client'
import shippingMethods from './shippingMethods'
// import { coupons } from './coupons'

const postInfo = async ({ response, info, preFetchData, cartState }) => {
	console.log(`Response: `, response)
	console.log(`Info: `, info)
	console.log(`Prefetech:`, preFetchData)
	console.log(`Cart State: `, cartState)

	const client = new EscaAPIClient()

	const products = await client.loadProducts({
		fields: [`inventory`,`price`,`brand`,`category`,`subcategory`,`product_type`,`shipping`],
		...preFetchData,
	})
	console.log(`Product API`, products)

	const shipping = await shippingMethods(info, products, client.shippingQuote)

	const res = {
		success: true,
		messages: {error: [], info: []},
		modifications: [],
		shippingMethods: shipping,
		selectedShippingMethod: shipping[0],
		quantityModifications: [],
	}
	return res
}

export { postInfo }