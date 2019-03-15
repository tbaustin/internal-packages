import fetch from 'isomorphic-fetch'

import centsToDollars from 'zygote-cart/dist/utils/cents-to-dollars'
import settingsState from 'zygote-cart/dist/state/settings'

let headers = {}
try {
	headers = require('../headers')
} catch (e) {
	// no headers, no problem
}

const calculateTax = async ({ shippingAddress, subtotal = 0, shipping = 0, discount = 0 }) => {
	if (!shippingAddress.shippingStateAbbr) return {}
	if (!settingsState.state.tax) return {}
	
	let checkTax = {
		state: shippingAddress.shippingStateAbbr,
		subtotal: centsToDollars(subtotal),
		shipping: centsToDollars(shipping),
		discount: centsToDollars(discount < 0 ? discount * -1 : discount),
	}

	return await fetch(`https://taxes-test.escsportsapi.com/calculate`, { // Get taxes
		method: `post`,
		body: JSON.stringify(checkTax),
		headers: headers,
	})
		.then(response => response.json())
		.then(jsonBody => {
			if (jsonBody.errors) {
				throw Error(jsonBody.errors)
			}
			return {
				id: `tax`,
				description: jsonBody.tax.label,
				value: parseInt(jsonBody.tax.value.toString().replace(/\./g, ''), 10),
			}
		})
		.catch(error => console.log('Failed to calculate taxes', error))
}

export { calculateTax }
