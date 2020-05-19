const  calculateTax = async ({ order, orderIds }, callback) => {
	console.log(`Calculate Tax`)

	let taxes = {}
	for (let index = 0; index < orderIds.length; index++) {
		const element = orderIds[index]
		let [location, orderId] = Object.entries(element)[0]
		order.order_id = orderId
		//TODO: replace customer_nubmber & duties
		let tax = await callback({
			src: `WEB`,
			action: `create`,
			trans_id: orderId,
			order: {
				order_id: orderId,
				customer_number: 19000,
				warehouse: location,
				ship_street1: order.delivery.street1,
				ship_city: order.delivery.city,
				ship_state: order.delivery.state,
				ship_zip: order.delivery.zip,
				ship_country: order.delivery.country,
				bill_street1: order.delivery.street1,
				bill_city: order.delivery.city,
				bill_state: order.delivery.state,
				bill_zip: order.delivery.zip,
				bill_country: order.delivery.country,
				products: order.locations[location].products,
				shipping: Object.keys(order.locations[location].shipping.options)[0],
				discounts: order.discounts,
				// duties: 20,
				total: order.total,
			},
		})
		Object.assign(taxes, {
			[location]: tax,
		})
		console.log(`Tax: `, tax)
	}
	return taxes
}

export default calculateTax
