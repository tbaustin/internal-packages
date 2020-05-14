import fetch from 'isomorphic-fetch'

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
					country: `US`,
					phone: info.infoPhone,
				},
				billing: `delivery`,
				products: shipping.products,
				discounts: [],
			},
		}

		console.log(`SENT TO COUPON CALCULATE API: `, JSON.stringify(check, null, 2))

		const res = fetch(`/api/coupon/calculate`, { // Get packing dimensions
			method: `post`,
			body: JSON.stringify(check),
		})

		return res
	}

	return null
}

export { coupons }
