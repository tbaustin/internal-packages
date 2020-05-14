import fetch from 'isomorphic-fetch'
import shortid from 'shortid'

import { centsToDollars } from '../utils/helpers'


const preOrder = async ({ preFetchData, info, cartState }) => {
	const {
		productsState,
		customerState,
		totalsState,
		shippingState,
		findShippingMethod,
	} = cartState

	console.log(`ship bill info: `, info)
	console.log(`prefetch info: `, preFetchData)

	const bind_id = shortid.generate()
	const auth0_id = customerState.state.customer ? customerState.state.customer.username : ``
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
			state: info.shippingStateAbbr,
			zip: info.shippingZip,
			company: info.shippingCompany || ``,
			phone: info.infoPhone || ``,
			country: `US`,
		}


	console.log(`BILLING: `, billing)
	console.log(`DELIVERY: `, delivery)

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
		orders[product.location].products[product.id.toUpperCase()] = {
			length: product.length,
			width: product.width,
			height: product.height,
			weight: product.weight,
			fc: product.freight_class || product.fc,
			price: centsToDollars(product.price),
			qty: product.quantity,
		}
		orders[product.location].locationTotal = parseFloat(orders[product.location].locationTotal) + centsToDollars(product.price)
		console.log(`SHIPPING STATE: `, shippingState)
		const selected = shippingState.state.selected[product.location] || shippingState.state.selected
		const method = findShippingMethod(selected, shippingState.state.selected[product.location] ? product.location : false)
		const value = centsToDollars(method.value)

		console.log(`SHIPPING METHOD: `,  method)

		orders[product.location].locationTotal = parseFloat(orders[product.location].locationTotal) + parseFloat(value)

		orders[product.location].shipping.options[value] = {
			label: method.description,
			value,
		}
		orders[product.location].shipping.skus.push(product.id)
	})

	Object.keys(orders).map(location => {
		orders[location].discounts = discounts
		const taxVal = taxes && typeof taxes === `object` ? taxes.value : 0
		orders[location].taxes = {
			value: (centsToDollars(taxVal) * (parseFloat(orders[location].locationTotal) / parseFloat(centsToDollars(totalsState.state.total - taxVal)))).toFixed(2),
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
		},
	}

	if (preFetchData.payment && preFetchData.paymentType) {
		payment.order.payment = {
			validation: preFetchData.payment || ``,
			type: preFetchData.paymentType || ``,
		}
	}

	console.log(`SENT TO CREATE ORDER: `, JSON.stringify(payment, null, 2))

	let res = await fetch(`/api/orders/store`, { // Create order
		method: `post`,
		body: JSON.stringify(payment),
	})

	res = await res.text()
	console.log(res)
	try {
		res = JSON.parse(res)
	} catch(e){
		console.log(`res.json() failed: `, e)
	}

	return res
}

export { preOrder }
