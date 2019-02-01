import fetch from 'isomorphic-fetch'
import shortid from 'shortid'

import productsState from 'zygote-cart/src/export/state/products'
import shippingState, { findShippingMethod } from 'zygote-cart/src/export/state/shipping'
import customerState from 'zygote-cart/src/export/state/customer'
import totalsState from 'zygote-cart/src/export/state/totals'
import centsToDollars from 'zygote-cart/src/export/utils/cents-to-dollars'

let headers = {}
try {
	headers = require('../headers')
} catch (e) {
	// no headers, no problem
}

const preInfo = async ({ info }) => {
	return {
		skus: info.products ? info.products.map(function(product) { return product.id }) : []
	}
}

const postInfo = async ({ response, info, preFetchData }) => {
	const { inventory } = response
	const quantityModifications = Object.keys(inventory).map(id => {
		return {
			id: id,
			available: inventory[id].stock || 0,
		}
	})

	let shippingMethods = {}, selectedShippingMethod = {}
	await fetch(`https://products-test.escsportsapi.com/shipping`, { // Get packing dimensions
		method: `post`,
		body: JSON.stringify(preFetchData),
		headers: headers,
	})
		.then(response => response.json())
		.then(jsonBody => {
			if (jsonBody.errors) {
				throw Error(jsonBody.errors)
			}

			let products = []
			if (jsonBody.products && Object.keys(jsonBody.products).length > 0) {
				for (let key in jsonBody.products) {
					const item = info.products.find(obj => obj.id == key)
					products.push({
						...item,
						...jsonBody.products[key]
					})
					const available = quantityModifications.find(obj => obj.id == key).available
					jsonBody.products[key].qty = item
						? available < item.quantity
							? available
							: item.quantity 
						: 0
					if (jsonBody.products[key].freight_class && !jsonBody.products[key].fc) {
						jsonBody.products[key].fc = jsonBody.products[key].freight_class 
					}
				}
				productsState.setState({ products })

				const shipping = {
					service: `ups`,
					destination: {
						street1: info.shippingAddress1,
						street2: info.shippingAddress2,
						city: info.shippingCity,
						state: info.shippingStateAbbr,
						zip: info.shippingZip,
						country: `US`,
						company: info.shippingCompany || ``,
						phone: info.infoPhone || ``,
					},
					products: Object.keys(jsonBody.products)
						.filter(key => jsonBody.products[key].qty && jsonBody.products[key].qty > 0)
						.reduce((res, key) => (res[key] = jsonBody.products[key], res), {}),
				}
				if (info.infoFirstName) {
					shipping.destination.first_name = info.infoFirstName
					shipping.destination.last_name = info.infoLastName
					shipping.destination.name = `${info.infoFirstName} ${info.infoLastName}`
				}
				else {
					shipping.destination.name = info.infoName
				}

				return fetch(`https://shipping-test.escsportsapi.com/load`, { // Get shipping cost
					method: `post`,
					body: JSON.stringify(shipping),
					headers: headers,
				})
			}
			else {
				throw Error(`No products were found.`)
			}
		})
		.then(response => response.json())
		//
		// Lookup coupons
		// ...WAITING...
		//
		.then(jsonBody => {
			if (jsonBody.errors) {
				throw Error(jsonBody.errors)
			}
			let standardShipping = 0, methodIndex = 0
			Object.keys(jsonBody).forEach(location => {
				let locationShippingMethods = {}
				Object.keys(jsonBody[location].options).forEach((cost, i) => {
					locationShippingMethods[cost] = {
						id: `method-${methodIndex}`,
						description: jsonBody[location].options[cost].label,
						value: parseInt(cost.toString().replace(/\./g, ''), 10),
						addInfo: `Get it ${jsonBody[location].options[cost].eta}!`,
					}
					if (i == 0) {
						standardShipping += locationShippingMethods[cost].value
						selectedShippingMethod[location] = `method-${methodIndex}`
					}
					methodIndex++
				})

				const products = [...productsState.state.products]
				shippingMethods[location] = {
					id: location,
					description: jsonBody[location].products.map(shipProd => {
						const thisProduct = products.find(reqProd => reqProd.id == shipProd)
						thisProduct.location = location
						return thisProduct.name
					}).join(', '),
					shippingMethods: Object.keys(locationShippingMethods).map(ship => locationShippingMethods[ship])
				}
				productsState.setState({ products })
			})
			let discount = 0
			totalsState.state.modifications.filter(mod => !mod.id.startsWith(`tax`) && !mod.id.startsWith(`shipping`)).forEach(mod => {
				discount += mod.value > 0 ? mod.value : (mod.value * -1)
			})

			return calculateTax({ 
				shippingAddress: info, 
				subtotal: info.totals.subtotal, 
				shipping: standardShipping,
				discount: discount,
			})
		})
		.then(tax => shippingMethods[Object.keys(shippingMethods)[0]].tax = tax)
		.catch(error => console.log(`Request failed`, error))

	return {
		success: inventory && shippingMethods ? true : false,
		modifications: [
			shippingMethods[Object.keys(shippingMethods)[0]].tax,
		],
		shippingMethods: Object.keys(shippingMethods).map(ship => shippingMethods[ship]),
		selectedShippingMethod: Object.keys(selectedShippingMethod).length == 1 ? selectedShippingMethod[Object.keys(selectedShippingMethod)[0]] : selectedShippingMethod,
		quantityModifications: quantityModifications,
	}
}

const slowFetch = async (order_objs, i, url) => {
	let responses = []
	await fetch(url, { // Create order
		method: `post`,
		body: order_objs[i],
		headers: headers,
	})
		.then(response => response.json())
		.then(response => {
			responses.push(response)
			if (order_objs.length > i + 1) {
				return slowFetch(order_objs, i + 1, url)
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

	/////////////////////////////// Slow fetch, multi call
	//
	// let order = []
	// const order_objs = Object.keys(orders).map(location => {
	// 	return JSON.stringify({
	// 		bind_id,
	// 		auth0_id,
	// 		email,
	// 		billing,
	// 		delivery,
	// 		products: orders[location].products,
	// 		shipping: orders[location].shipping,
	// 		discounts,
	// 		taxes: {
	// 			value: ((taxes.value / 100) * ((parseFloat(orders[location].locationTotal) + parseFloat(Object.keys(orders[location].shipping.options)[0])) / (totalsState.state.total / 100))).toFixed(2)
	// 		}
	// 	})
	// })

	// let i = 0
	// await fetch(`https://orders-test.escsportsapi.com/save`, { // Create order
	// 	method: `post`,
	// 	body: order_objs[i],
	// 	headers: headers,
	// })
	// 	.then(response => response.json())
	// 	.then(response => {
	// 		order.push(response)
	// 		if (order_objs.length > 1) {
	// 			return slowFetch(order_objs, i + 1, `https://orders-test.escsportsapi.com/save`).then(response => {
	// 				order = order.concat(response)
	// 			})
	// 		}
	// 	})
	// 	.then(response => {
	// 		// console.log(response)
	// 	})
	//
	//////////////////////////////////////

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

	return await fetch(`https://orders-test.escsportsapi.com/store`, { // Create order
		method: `post`,
		body: JSON.stringify(payment),
		headers: headers,
	})
		.then(response => response.json())
}

const postOrder = async ({ response, info, preFetchData }) => {
	let url, payment_obj, payments = []

	if (info.paymentType === 'paypal') {
		url = `https://pay-test.escsportsapi.com/paypal/verify`
		payment_obj = response.map(res => {
			return JSON.stringify({
				order_id: res.order_id ? res.order_id : res,
			})
		})
	}
	else {
		url = `https://pay-test.escsportsapi.com/authnet/make`
		payment_obj = response.map(res => {
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
				order_id: res.order_id ? res.order_id : res,
				payment: {
					card: {
						name: info.billingName,
						number: info.billingCardNumber.replace(/\s/g, ``).trim(),
						expire: {
							month: info.billingCardExpiration.split(`/`)[0].trim(),
							year: info.billingCardExpiration.split(`/`)[1].trim(),
						},
						code: info.billingCardCVC,
					},
				},
				method: `authnet`,
			})
		})
	}

	if (payment_obj.findIndex(pay => pay.error) == -1) {
		let i = 0
		await fetch(url, { // Send payment
			method: `post`,
			body: payment_obj[i],
			headers: headers,
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
		if (payments[x].error) {
			return {
				success: false,
				messages: {
					error: payments[x].error[0].message
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
	}
}

const calculateTax = async ({ shippingAddress, subtotal = 0, shipping = 0, discount = 0 }) => {
	if (!shippingAddress.shippingStateAbbr) return {}
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

export { preInfo, postInfo, calculateTax, preOrder, postOrder }