import fetch from 'isomorphic-fetch'
import { productsState, totalsState } from '@escaladesports/zygote-cart/dist/state'
import centsToDollars from '@escaladesports/zygote-cart/dist/utils/cents-to-dollars'
import * as Sentry from '@sentry/browser'

import { calculateTax } from './tax'
import { coupons } from './coupons'

const preInfo = async ({ info }) => {
	return {
		skus: info.products ? info.products.map(function(product) { return product.id }) : []
	}
}

const postInfo = async ({ response, info, preFetchData }) => {
	if (settingsState.state.sentryDsn) {
		console.log('init')
		Sentry.init({
			dsn: settingsState.state.sentryDsn,
			beforeSend(event) {
				console.log(event)
				return null
			}
		})
	}
	const { inventory } = response
	let quantityModifications = Object.keys(inventory).map(id => {
		return {
			id: id,
			available: inventory[id].stock || 0,
			location: inventory[id].locations && Object.keys(inventory[id].locations).length > 0 ? Object.keys(inventory[id].locations)[0] : ``,
		}
	})

	let shippingMethods = {}, selectedShippingMethod = {}, success = true, modifications = [], messages = { error: [], info: [] }, shipping = {}

	await fetch(`/api/products/shipping`, { // Get packing dimensions
		method: `post`,
		body: JSON.stringify(preFetchData),
	})
		.then(response => response.json())
		.then(jsonBody => {
			if (jsonBody.errors) {
				if (Sentry && Sentry.captureException) {
					Sentry.withScope(scope => {
						scope.setTag("zygote-plugin-esca-api", "info")
  					scope.setLevel('error')
						Sentry.captureException("Request: " + JSON.stringify(preFetchData))
						Sentry.captureException("Response: " + JSON.stringify(jsonBody))
					})
				}
				throw Error(jsonBody.errors)
			}

			let products = []
			if (jsonBody.products && Object.keys(jsonBody.products).length > 0) {
				for (let key in jsonBody.products) {
					const item = info.products.find(obj => obj.id == key)
					products.push({
						...item,
						...jsonBody.products[key],
						name: item.name,
					})
					const objMod = quantityModifications ? quantityModifications.find(obj => obj.id == key) : null
					const available = objMod ? objMod.available : 9999999
					jsonBody.products[key].qty = item
						? available < item.quantity
							? available
							: item.quantity 
						: 0
					jsonBody.products[key].location = objMod ? objMod.location : ``
					jsonBody.products[key].price = centsToDollars(item.price)
					if (jsonBody.products[key].freight_class && !jsonBody.products[key].fc) {
						jsonBody.products[key].fc = jsonBody.products[key].freight_class 
					}
				}

				productsState.setState({ products })

				shipping = {
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

				if (Object.keys(shipping.products).length == 0) {
					throw Error(`empty`)
				}

				if (info.infoFirstName) {
					shipping.destination.first_name = info.infoFirstName
					shipping.destination.last_name = info.infoLastName
					shipping.destination.name = `${info.infoFirstName} ${info.infoLastName}`
				}
				else {
					shipping.destination.name = info.infoName
				}

				return coupons({ info, shipping })
					.then(response => {
						if (response) { // There was a coupon
							return response.json()
						}
						else {
							return null
						}
					})
					.then(coupon => {
						if (coupon) {
							if (!coupon.valid) {
								messages.info.push(
									coupon.reason && coupon.reason.length > 0 ? `${coupon.error}. ${coupon.reason[0]}` : coupon.error
								)
								info.coupon = ''
							}
							else {
								modifications.push({
									id: coupon.code || info.coupon,
									description: coupon.label || 'Coupon',
									value: parseInt('-' + coupon.discount.toString().replace(/\./, '')),
									type: coupon.type || 'discount'
								})
							}
						}
						return fetch(`/api/shipping/load`, { // Get shipping cost
							method: `post`,
							body: JSON.stringify(shipping),
						})
					})
			}
			else {
				throw Error(`No products were found.`)
			}
		})
		.then(response => response.json())
		.then(jsonBody => {
			if (jsonBody.errors) {
				if (Sentry && Sentry.captureException) {
					Sentry.withScope(scope => {
						scope.setTag("zygote-plugin-esca-api", "info")
  					scope.setLevel('error')
						Sentry.captureException("Request: " + JSON.stringify(shipping))
						Sentry.captureException("Response: " + JSON.stringify(jsonBody))
					})
				}
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
						addInfo: jsonBody[location].options[cost].eta ? `Get it ${jsonBody[location].options[cost].eta}!` : ``,
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
		.then(tax => {
			if (tax) {
				shippingMethods[Object.keys(shippingMethods)[0]].tax = tax
			}
		})
		.catch(error => {
			if (error.message == `empty`) {
				quantityModifications = `all`
				success = false
				console.error('No items to send, all out of stock.')
			}
			else {
				success = false
				if (Sentry && Sentry.captureMessage) {
					Sentry.withScope(scope => {
						scope.setTag("zygote-plugin-esca-api", "info")
  					scope.setLevel('error')
						Sentry.captureMessage(error.message, Sentry.Severity.Error)
					})
				}
				throw Error(error)
			}
		})

	return {
		success: inventory && shippingMethods ? true && success : false,
		messages: messages,
		modifications: [
			...modifications,
			shippingMethods[Object.keys(shippingMethods)[0]] ? shippingMethods[Object.keys(shippingMethods)[0]].tax : { id: '', value: 0, description: '' },
		],
		shippingMethods: Object.keys(shippingMethods).map(ship => shippingMethods[ship]),
		selectedShippingMethod: Object.keys(selectedShippingMethod).length == 1 ? selectedShippingMethod[Object.keys(selectedShippingMethod)[0]] : selectedShippingMethod,
		quantityModifications: quantityModifications,
	}
}

export { preInfo, postInfo }