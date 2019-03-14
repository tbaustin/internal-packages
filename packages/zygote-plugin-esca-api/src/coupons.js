import fetch from 'isomorphic-fetch'

let headers = {}
try {
	headers = require('../headers')
} catch (e) {
	// no headers, no problem
}

const coupons = async ({ info, shipping }) => {
	if (info.coupon) {
		const check = {
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
					country: "US",
					phone: info.infoPhone
				},
				billing: "delivery",
				products: shipping.products,
				discounts: []
			}
		}

		return fetch(`https://coupon-test.escsportsapi.com/calculate`, { // Get packing dimensions
			method: `post`,
			body: JSON.stringify(check),
			headers: headers,
		})
	}
	
	return null
}

export { coupons }
