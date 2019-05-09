import fetch from 'isomorphic-fetch'
import shortid from 'shortid'
import * as Sentry from '@sentry/browser'

import { productsState, customerState, totalsState, settingsState } from '@escaladesports/zygote-cart/dist/state'
import shippingState, { findShippingMethod } from '@escaladesports/zygote-cart/dist/state/shipping'

import centsToDollars from '@escaladesports/zygote-cart/dist/utils/cents-to-dollars'

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
				return slowFetch(order_objs, i + 1, url, head)
			}
		})
		.then(response => {
			// console.log(response)
		})
	
	return responses
}

const preOrder = async ({ preFetchData, info }) => {
	const bind_id = shortid.generate()
	const auth0_id = customerState.state.customer ? customerState.state.customer.username : ''
	const email = info.infoEmail
	const billing = info.sameBilling 
		? {
			first_name: info.billingFirstName,
			last_name: info.billingLastName,
			street1: info.shippingAddress1,
			street2: info.shippingAddress2,
			city: info.shippingCity,
			state: info.billingStateAbbr,
			zip: info.shippingZip,
			company: info.shippingCompany || ``,
			phone: info.infoPhone || ``,
			country: `US`,
		}
		: {
			first_name: info.billingFirstName,
			last_name: info.billingLastName,
			street1: info.billingAddress1,
			street2: info.billingAddress2,
			city: info.billingCity,
			state: info.billingStateAbbr,
			zip: info.billingZip,
			company: info.shippingCompany || ``,
			phone: info.infoPhone || ``,
			country: `US`,
		}
	const delivery = info.sameBilling 
		? `billing` 
		: {
			first_name: info.billingFirstName,
			last_name: info.billingLastName,
			street1: info.shippingAddress1,
			street2: info.shippingAddress2,
			city: info.shippingCity,
			state: info.billingStateAbbr,
			zip: info.shippingZip,
			company: info.shippingCompany || ``,
			phone: info.infoPhone || ``,
			country: `US`,
		}

	const taxes = totalsState.state.modifications.find(mod => mod.id == `tax`)
	const discounts = {}
	totalsState.state.modifications.filter(mod => !mod.id.startsWith(`tax`) && !mod.id.startsWith(`ship`)).forEach(mod => {
		discounts[mod.id] = mod.value > 0 ? centsToDollars(mod.value) : centsToDollars(mod.value * -1)
	})

	const products = [...productsState.state.products]
	const orders = {}

	products.forEach(product => {
		if (!orders[product.location]) {
			orders[product.location] = {
				products: {},
				shipping: {
					options: {},
					skus: [],
				},
				locationTotal: 0,
			}
		}
		orders[product.location].products[product.id] = {
			length: product.length,
			width: product.width,
			height: product.height,
			weight: product.weight,
			fc: product.freight_class || product.fc,
			price: centsToDollars(product.price),
			qty: product.quantity
		}
		orders[product.location].locationTotal = parseFloat(orders[product.location].locationTotal) + centsToDollars(product.price)

		const selected = shippingState.state.selected[product.location] || shippingState.state.selected
		const method = findShippingMethod(selected, shippingState.state.selected[product.location] ? product.location : false)
		const value = centsToDollars(method.value)

		orders[product.location].locationTotal = parseFloat(orders[product.location].locationTotal) + parseFloat(value)

		orders[product.location].shipping.options[value] = {
			label: method.description,
			value,
		}
		orders[product.location].shipping.skus.push(product.id)
	})

	Object.keys(orders).map(location => {
		orders[location].discounts = discounts
		orders[location].taxes = {
			value: (centsToDollars(taxes.value) * (parseFloat(orders[location].locationTotal) / parseFloat(centsToDollars(totalsState.state.total - taxes.value)))).toFixed(2)
		}
	})

	const payment = {
		order: {
			bind_id,
			auth0_id,
			email,
			billing,
			delivery,
			locations: orders,
		}
	}

	if (preFetchData.payment && preFetchData.paymentType) {
		payment.order.payment = {
			validation: preFetchData.payment || ``,
			type: preFetchData.paymentType || ``
		}
	}

	return await fetch(`/api/orders/store`, { // Create order
		method: `post`,
		body: JSON.stringify(payment),
	})
		.then(response => response.json())
}

const postOrder = async ({ response, info, preFetchData }) => {
	if (settingsState.state.sentryDsn) {
		Sentry.init({
			dsn: settingsState.state.sentryDsn
		})
	}
	let url, payment_obj, payments = []

	if (info.paymentType === 'paypal') {
		url = `/api/pay/paypal`
		payment_obj = response.order_id.map(res => {
			return JSON.stringify({
				order_id: res.order_id ? res.order_id : res,
			})
		})
	}
	else {
		info.paymentType = `anet`
		url = `/api/pay/anet`
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
		await fetch(url, { // Send payment
			method: `post`,
			body: payment_obj[i],
		})
			.then(response => response.json())
			.then(response => {
				payments.push(response)
				if (payment_obj.length > 1) {
					return slowFetch(payment_obj, i + 1, url).then(response => {
						payments = payments.concat(response)
					})
				}
			})
			.then(response => {
				// console.log(response)
			})
	}

	for (let x = 0; x < payments.length; x++) {
		if (payments[x].error && payments[x].error.length > 0) {
			if (Sentry && Sentry.captureMessage) {
				Sentry.captureMessage(payments[x].error[0].message, Sentry.Severity.Error)
			}
			return {
				success: false,
				messages: {
					error: payments[x].error[0].message
				}
			}
		}
		else if (payments[x].errorMessage) {
			if (Sentry && Sentry.captureException) {
				Sentry.captureException(payments[x])
			}
			return {
				success: false,
				messages: {
					error: `${payments[x].errorMessage}${payments[x].reasons ? ` ${payments[x].reasons.join(`. `)}` : ``}`
				}
			}
		}
		else if (payments[x].message && payments[x].message == 'Forbidden') {
			if (Sentry && Sentry.captureException) {
				Sentry.captureException(payments[x])
			}
			return {
				success: false,
				messages: {
					error: 'There was an error trying to place payment on this order.'
				}
			}
		}

		if (payments[x].verified == false) {
			return {
				success: false,
				messages: {
					error: "Failed to verify transaction."
				}
			}
		}
	}

	return {
		success: true,
		meta: {
			orderId: response.order_id.map(order => order.order_id ? `${info.paymentType}|${order.order_id}` : `${info.paymentType}|${order}`)
		}
	}
}

export { preOrder, postOrder }
