import client from '../client'


export async function preOrder(data) {
	let { info, preFetchData: { meta: { orderRequest } } } = data

	client.setRecaptchaToken(info.recaptchaToken)

	orderRequest.card = {
		number: info.billingCardNumber,
		expire: {
			month: info.billingCardExpiration.split(`/`)[0].trim(),
			year: info.billingCardExpiration.split(`/`)[1].trim(),
		},
		code: info.billingCardCVC,
	}

	// If billing address is different, add that to the order object
	if (!info.sameBilling) {
		orderRequest.order.billing = {
			first_name: info.billingFirstName,
			last_name: info.billingLastName,
			company: info.billingCompany,
			street1: info.billingAddress1,
			street2: info.billingAddress2,
			city: info.billingCity,
			state: info.billingStateAbbr,
			zip: info.billingZip,
			country: `US`,
			phone: info.infoPhone,
		}
	}

	const {
		warnings,
		order_id,
		bind_id,
		paid
	} = await client.storeOrder(orderRequest)

	return {
		warnings,
		order_id,
		bind_id,
		paid
	}
}
