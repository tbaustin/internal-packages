import { toCents } from '@escaladesports/utils'
import client from '../client'


export default async function coupons(info, products) {
	if (!info.coupon) return {}

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

	if (response.valid) {
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
		message: response.errorMessage,
	}
}
