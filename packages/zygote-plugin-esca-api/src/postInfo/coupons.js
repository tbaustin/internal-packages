import { toCents } from '@escaladesports/utils'
import client from '../client'


export default async function coupons(info, products, productsState) {
	console.log(`Coupons Function`, info, products)

	if (!info.coupon) return {}

	let modifications = []

	// Get coupon from the API
	let response = await client.calculateDiscount({
		code: info.coupon,
		order: {
			email: info.infoEmail,
			delivery: {
				first_name: info.infoFirstName,
				last_name: info.infoLastName,
				company: info.shippingCompany,
				street1: info.shippingAddress1,
				street2: info.shippingAddress2,
				city: info.shippingCity,
				state: info.shippingStateAbbr,
				zip: info.shippingZip,
				country: `US`,
				phone: info.infoPhone,
			},
			billing: `delivery`,
			products
			// discounts: [],
		}
	})

	// console.log(`Coupon Response: `, response)

	if (response.valid && !response.errors) {
		if(response.item){
			const { sku, name, qty, price } = response.item
			let itemRes = await fetch(`/api/products/load`, { method: `post`, body: JSON.stringify({
				skus: [ sku ],
				salsify: [`Web Images`],
			})})
			itemRes = await itemRes.json()
			const foundProduct = itemRes.products[sku]
			console.log(`PRODUCT FOR COUPON: `, foundProduct)

			const item = {
				...response.item,
				name: name,
				id: sku,
				quantity: +qty,
				image: foundProduct[`Web Images`] && foundProduct[`Web Images`][0],
				price: price,
				shippable: true,
			}
			console.log(`ITEM FROM COUPON: `, item)
			
			const { products: prevProducts } = productsState.state
			productsState.setState({ products: [ ...prevProducts, item ]})
		}
		return {
			coupon: {
				id: info.coupon,
				description: response.label || `Coupon`,
				value: 0 - toCents(response.discount),
				type: response.type || `discount`,
				dollarDiscount: response.discount,
				locations: response.locations,
			}
		}
	}

	return {
		message: response.errorMessage
	}
}
