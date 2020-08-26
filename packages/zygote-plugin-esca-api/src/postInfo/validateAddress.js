import { ValidationError } from '@escaladesports/esca-api-client'
import client from '../client'


export default async function validateAddress(info) {
	// Validate address from the API
	const result = await client.validateAddress({
		address: {
			street1: info.shippingAddress1,
			street2: info.shippingAddress2,
			city: info.shippingCity,
			state: info.shippingStateAbbr,
			zip: info.shippingZip,
			phone: info.infoPhone,
			email: info.infoEmail,
			country: `US`
		}
	})

	if (!result.valid) {
		throw new ValidationError(result.reason)
	}
}
