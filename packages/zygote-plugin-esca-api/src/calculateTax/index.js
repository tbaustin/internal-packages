import EscaAPIClient from '@escaladesports/esca-api-client'
import { toCents, toDollars } from '@escaladesports/utils'

export const calculateTax = async ({
	cartState: {
		shippingState: {
			state: {
				selected,
				methods,
			},
		},
		metaState: {
			state: {
				meta: {
					orderRequest: {
						order,
					},
				},
			},
		},
	},
}) => {
	const client = new EscaAPIClient()

	//Create array of shipping options and values for indexing
	let shippingMethods = []
	methods.forEach(element => {
		element.shippingMethods.forEach(method => {
			shippingMethods[method.id] = method.value
		})
	})
	let taxValue = 0
	let taxNames = []
	let locations = []
	for(let [locationName, locationData] of Object.entries(order.locations)){
		//TODO: replace customer_nubmber
		let tax = await client.calculateTaxes({
			src: `WEB`,
			action: `create`,
			trans_id: locationData.order_id,
			order: {
				order_id: locationData.order_id,
				customer_number: 19000,
				warehouse: locationName,
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
				products: order.locations[locationName].products,
				shipping: toDollars(shippingMethods[selected[locationName]]),
				discounts: order.discounts,
				// duties: 20,
				total: order.total,
			},
		})
		taxValue += tax.value
		taxNames.push(tax.label)
		locations.push({
			name: locationName,
			value: tax.value,
		})
	}
	return {
		id: `tax`,
		description: `Tax`,
		value: toCents(taxValue),
		locations,
	}
}
