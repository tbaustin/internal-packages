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
