import EscaAPIClient from '@escaladesports/esca-api-client'

const preOrder = async ( data )  => {
	console.log(`PreOrder`, data)
	var { info, preFetchData: { meta: { orderRequest } } } = data

	orderRequest.card = {
		number: info.billingCardNumber,
		expire: {
			month: info.billingCardExpiration.split(`/`)[0].trim(),
			year: info.billingCardExpiration.split(`/`)[1].trim(),
		},
		code: info.billingCardCVC,
	}

	//if billing address is different, add that to the order object
	console.log(`Billing Info`, info)
	if(!info.sameBilling){
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
	console.log(`PreOrder: `, orderRequest, info)
	
	const client = new EscaAPIClient({recaptchaToken: info.recaptchaToken})
	var {
		warnings,
		order_id,
		bind_id,
		paid,
	} = await client.storeOrder(orderRequest)

	return {
		warnings,
		order_id,
		bind_id,
		paid,
	}
}

export { preOrder }
