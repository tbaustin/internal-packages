import fetch from 'isomorphic-fetch'

import productsState from 'zygote-cart/src/export/state/products'
import shippingState, { findShippingMethod } from 'zygote-cart/src/export/state/shipping'
import customerState from 'zygote-cart/src/export/state/customer'

const headers = {}

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
			availble: inventory[id].stock || 0,
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
					const availble = quantityModifications.find(obj => obj.id == key).availble
					jsonBody.products[key].qty = item
						? availble < item.quantity
							? availble
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
						name: info.infoName,
						street1: info.shippingAddress1,
						street2: info.shippingAddress2,
						city: info.shippingCity,
						state: info.shippingStateAbbr,
						zip: info.shippingZip,
						country: `US`,
					},
					products: Object.keys(jsonBody.products)
						.filter(key => jsonBody.products[key].qty && jsonBody.products[key].qty > 0)
						.reduce((res, key) => (res[key] = jsonBody.products[key], res), {}),
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
		// Lookup cupons
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

				if (Object.keys(jsonBody).length > 1) {
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
				}
				else {
					shippingMethods = locationShippingMethods
				}
			})
			return calculateTax({ 
				shippingAddress: info, 
				subtotal: info.totals.subtotal, 
				shipping: standardShipping,
				discount: 0,
			})
		})
		.then(tax => shippingMethods[Object.keys(shippingMethods)[0]].tax = tax)
		.catch(error => console.log(`Request failed`, error))

	return {
		success: inventory && shippingMethods ? true : false,
		modifications: [
			{
				id: `january-sale`,
				description: `January Sale`,
				value: -2000,
			},
			shippingMethods[Object.keys(shippingMethods)[0]].tax,
		],
		shippingMethods: Object.keys(shippingMethods).map(ship => shippingMethods[ship]),
		selectedShippingMethod: Object.keys(selectedShippingMethod).length == 1 ? selectedShippingMethod[Object.keys(selectedShippingMethod)[0]] : selectedShippingMethod,
		quantityModifications: quantityModifications,
	}
}

const preOrder = async ({ info }) => {
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
			}
		}
		orders[product.location].products[product.id] = {
			length: product.length,
			width: product.width,
			height: product.height,
			weight: product.weight,
			fc: product.freight_class || product.fc,
			price: (product.price / 100).toFixed(2),
			qty: product.quantity
		}

		const selected = shippingState.state.selected[product.location] || shippingState.state.selected
		const method = findShippingMethod(selected, shippingState.state.selected[product.location] ? product.location : false)
		const value = (method.value / 100).toFixed(2)

		orders[product.location].shipping.options[value] = {
			label: method.description,
			value: value
		}
		orders[product.location].shipping.skus.push(product.id)
	})

	return {
    email: info.infoEmail,
    delivery: {
      name: info.infoName,
      street1: info.shippingAddress1,
      street2: info.shippingAddress2,
      city: info.shippingCity,
      state: info.shippingStateAbbr,
      zip: info.shippingZip,
      country: `US`,
    },
		billing: info.sameBilling 
			? `billing` 
			: {
				name: info.infoName,
				street1: info.billingAddress1,
				street2: info.billingAddress2,
				city: info.billingCity,
				state: info.billingStateAbbr,
				zip: info.billingZip,
				country: `US`,
			},
		orders: orders,
		auth0_id: customerState.state.customer ? customerState.state.customer.username : null,
  }
}

const postOrder = async ({ response, info, preFetchData }) => {
	const payment = {
		order_id: response[0].order_id,
		payment: {
			name: info.billingName,
			number: info.billingCardNumber,
			expire: {
				month: info.billingCardExpiration.split(`/`)[0].trim(),
				year: info.billingCardExpiration.split(`/`)[1].trim(),
			},
			code: info.billingCardCVC,
		},
		method: `authnet`,
	}
	return await fetch(`https://pay-dev.escsportsapi.com/authnet/make`, { // Send payment
		method: `post`,
		body: JSON.stringify(payment),
		headers: headers,
	})
}

const calculateTax = async ({ shippingAddress, subtotal = 0, shipping = 0, discount = 0 }) => {
	if (!shippingAddress.shippingStateAbbr) return {}
	let checkTax = {
		state: shippingAddress.shippingStateAbbr,
		subtotal: (subtotal / 100).toFixed(2),
		shipping: (shipping / 100).toFixed(2),
		discount: (discount / 100).toFixed(2),
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