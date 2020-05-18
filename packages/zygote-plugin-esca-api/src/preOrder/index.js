import EscaAPIClient from '@escaladesports/esca-api-client'

const preOrder = async ( { info, preFetchData: { meta: { order, orderIds } } })  => {
	console.log(`PreOrder`)
	//Add order id's into the order object
	orderIds.forEach(element => {
		let [location, orderId] = Object.entries(element)[0]
		order.locations[location].order_id = orderId
	})

	order.payment = {
		name: info.billingFirstName,
		number: info.billingCardNumber,
		expire: {
			month: info.billingCardExpiration.split(`/`)[0].trim(),
			year: info.billingCardExpiration.split(`/`)[1].trim(),
		},
		code: info.billingCardCVC,
	}
	console.log(`PreOrder: `, order, info)
	
	const client = new EscaAPIClient()
	var {
		warnings,
		order_id,
		bind_id,
		paid,
	} = await client.storeOrder(order)

	return {
		warnings,
		order_id,
		bind_id,
		paid,
	}
}

export { preOrder }
