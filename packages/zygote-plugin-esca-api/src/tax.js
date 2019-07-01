import fetch from 'isomorphic-fetch'
import * as Sentry from '@sentry/browser'

import centsToDollars from '@escaladesports/zygote-cart/dist/utils/cents-to-dollars'
import settingsState from '@escaladesports/zygote-cart/dist/state/settings'

const calculateTax = async ({ shippingAddress, subtotal = 0, shipping = 0, discount = 0 }) => {
	if (settingsState.state.sentryDsn) {
		Sentry.init({
			dsn: settingsState.state.sentryDsn,
			beforeSend(event) {
				if (event.tags && event.tags[`zygote-plugin-esca-api`]) {
					return event
				}
				return null
			}
		})
	}

	if (!shippingAddress.shippingStateAbbr || !settingsState.state.tax) {
		return {
			id: `tax`,
			description: `Tax`,
			value: 0,
		}
	}

	let checkTax = {
		state: shippingAddress.shippingStateAbbr,
		subtotal: subtotal && subtotal > 0 ? centsToDollars(subtotal) : 0,
		shipping: shipping && shipping > 0 ? centsToDollars(shipping) : 0,
		discount: discount && discount > 0 ? centsToDollars(discount < 0 ? discount * -1 : discount) : 0,
	}

	return await fetch(`/api/taxes/calculate`, { // Get taxes
		method: `post`,
		body: JSON.stringify(checkTax),
	})
		.then(response => response.json())
		.then(jsonBody => {
			if (jsonBody.errors) {
				if (Sentry && Sentry.captureException) {
					Sentry.withScope(scope => {
						scope.setTag("zygote-plugin-esca-api", "tax")
  					scope.setLevel('error')
						Sentry.captureException("Request: " + JSON.stringify(checkTax), Sentry.Severity.Error)
						Sentry.captureException("Response: " + JSON.stringify(jsonBody), Sentry.Severity.Error)
					})
				}
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
