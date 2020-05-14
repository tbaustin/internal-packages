import fetch from 'isomorphic-fetch'
import * as Sentry from '@sentry/browser'

const slowFetch = async (order_objs, i, url) => {
	let responses = []
	await fetch(url, { // Create order
		method: `post`,
		body: order_objs[i],
	})
		.then(response => response.json())
		.then(response => {
			responses.push(response)
			if (order_objs.length > i + 1) {
				return slowFetch(order_objs, i + 1, url)
			}
		})
		.then(response => {
			console.log(response)
		})

	return responses
}

const postOrder = async ({ response, info, cartState }) => {
	const {
		settingsState,
	} = cartState

	if (settingsState.state.sentryDsn) {
		Sentry.init({
			dsn: settingsState.state.sentryDsn,
			beforeSend(event) {
				if (event.tags && event.tags[`zygote-plugin-esca-api`]) {
					return event
				}
				return null
			},
		})
	}

	let url, payment_obj, payments = []

	if (info.paymentType === `paypal`) {
		url = `/api/pay/paypal`
		payment_obj = response.order_id.map(res => {
			return JSON.stringify({
				order_id: res.order_id ? res.order_id : res,
			})
		})
	}
	else {
		info.paymentType = `anet`
		url = `/api/authnet`
		payment_obj = response.order_id.map(res => {
			if (info.billingName === ``) {
				payments.push({ error: `Invalid billing name provided.` })
			}
			if (info.billingCardNumber === ``) {
				payments.push({ error: `Invalid credit card number provided.` })
			}
			if (info.billingCardExpiration === ``) {
				payments.push({ error: `Invalid credit card expiration provided.` })
			}
			if (info.billingCardCVC === ``) {
				payments.push({ error: `Invalid credit card CVC provided.` })
			}
			return JSON.stringify({
				order_id: res[Object.keys(res)[0]],
				card: {
					number: info.billingCardNumber.replace(/\s/g, ``).trim(),
					code: info.billingCardCVC,
					expire: {
						month: info.billingCardExpiration.split(`/`)[0].trim(),
						year: info.billingCardExpiration.split(`/`)[1].trim(),
					},
				},
				action: `authcap`,
			})
		})
	}

	if (payment_obj.findIndex(pay => pay.error) == -1) {
		let i = 0
		console.log(`URL: `, url)
		console.log(`BODY: `, payment_obj[i])
		let res = await fetch(url, { // Send payment
			method: `post`,
			body: payment_obj[i],
		})
		res = await res.text()
		console.log(`RES FROM PAYMENT: `, res)
		try {
			res = JSON.parse(res)
			payments.push(res)
			if (payment_obj.length > 1) {
				return slowFetch(payment_obj, i + 1, url).then(response => {
					payments = payments.concat(response)
				})
			}
		} catch(e){
			console.log(`res.json() failed: `, e)
			return {
				success: false,
				messages: {
					error: `Something went wrong with submitting your payment, please try again.`,
				},
			}
		}
	}

	console.log(`PAYMENTS RESPONSE: `, JSON.stringify(payments, null, 2))

	for (let x = 0; x < payments.length; x++) {
		if(payments[x].failed) {
			const { reason, avs, cvv } = payments[x]
			const errorMessage = `
			${reason} \n
			${avs ? `
				${avs.response}. \n
				${avs.detail} \n
			` : ``}
			${cvv ? `
				${cvv.response}. \n
				${cvv.detail} \n
			` : ``}
			`
			console.log(`PAYMENT FAILED`, errorMessage)
			return {
				success: false,
				messages: {
					error: errorMessage,
				},
			}
		}
		if (payments[x].error && payments[x].error.length > 0) {
			if (Sentry && Sentry.captureMessage) {
				Sentry.withScope(scope => {
					scope.setTag(`zygote-plugin-esca-api`, `order`)
					scope.setLevel(`error`)
					Sentry.captureMessage(payments, Sentry.Severity.Error)
				})
			}
			return {
				success: false,
				messages: {
					error: payments[x].error[0].message,
				},
			}
		}
		else if (payments[x].errorMessage) {
			if (Sentry && Sentry.captureException) {
				Sentry.withScope(scope => {
					scope.setTag(`zygote-plugin-esca-api`, `order`)
					scope.setLevel(`error`)
					Sentry.captureMessage(payments, Sentry.Severity.Error)
				})
			}
			return {
				success: false,
				messages: {
					error: `${payments[x].errorMessage}${payments[x].reasons ? ` ${payments[x].reasons.join(`. `)}` : ``}`,
				},
			}
		}
		else if (payments[x].message && payments[x].message == `Forbidden`) {
			if (Sentry && Sentry.captureException) {
				Sentry.withScope(scope => {
					scope.setTag(`zygote-plugin-esca-api`, `order`)
					scope.setLevel(`error`)
					Sentry.captureException(payments[x])
				})
			}
			return {
				success: false,
				messages: {
					error: `There was an error trying to place payment on this order.`,
				},
			}
		}

		if (payments[x].verified == false) {
			return {
				success: false,
				messages: {
					error: `Failed to verify transaction.`,
				},
			}
		}
	}

	return {
		success: true,
		meta: {
			orderId: response.order_id.map(order => `${info.paymentType}|${JSON.stringify(order)}`),
		},
	}
}

export { postOrder }
