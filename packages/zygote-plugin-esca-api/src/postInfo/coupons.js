import { toCents } from '@escaladesports/utils'
import client from '../client'


export default async function coupons(info, products, productsState) {
	if (!info.coupon) return {}

	let modifications = []

	/**
	 * Coupon service only requires product objects to have a 'qty' property
	 * Sending certain other properties (e.g. 'locations') causes 500 responses
	 */
	const productsQtyOnly = Object.keys(products).reduce((obj, sku) => {
		const product = products[sku]
		const { qty } = product || {}
		return { ...obj, [sku]: { qty } }
	}, {})

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
			products: productsQtyOnly
		}
	})

	if (response.valid && !response.errors) {
		if (response.item) {
			const { sku, name, qty, price } = response.item

			let itemRes = await client.loadProducts({
				skus: [ sku ],
				salsify: [`Web Images`],
				returnAsObject: true
			})

			const foundProduct = itemRes[sku]

			const item = {
				...response.item,
				name: name,
				id: sku,
				description: `Promo item (${info.coupon})`,
				quantity: +qty,
				image: foundProduct?.[`Web Images`]?.[0],
				price: price,
				shippable: true,
				isPromo: true
			}

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
