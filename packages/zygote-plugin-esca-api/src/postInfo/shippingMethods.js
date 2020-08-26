import { toCents } from '@escaladesports/utils'
import client from '../client'


const shippingMethods = async (info, products) => {
	//Get shipping quote from the API
	var shippingQuote = await client.loadShipping({
		destination:{
			first_name: info.infoFirstName,
			last_name: info.infoLastName,
			street1: info.shippingAddress1,
			street2: info.shippingAddress2,
			city: info.shippingCity,
			state: info.shippingStateAbbr,
			zip: info.shippingZip,
			phone: info.infoPhone || ``,
			email: info.infoEmail,
			country: `US`,
		},
		products,
	})

	//Build shipping methods object for Zygote
	let shipping = {
		shippingMethods: [],
		selectedShippingMethod: [],
		orderLocations: {},
	}
	// optionCount used to make unique shipping method IDs
	let optionCount = 0
	for (let [name, location] of Object.entries(shippingQuote)) {
		let {
			options,
			products: locationItems,
			service,
		} = location
		//Get shipping methods for the location
		let shippingMethods = mapShipping(options, optionCount)
		//Get location specific products
		let locationProducts = joinProducts(locationItems, products)
		//Add location shipping methods
		shipping.shippingMethods.push({
			id: name,
			description: locationProducts.map(product => product.name).join(),
			shippingMethods: shippingMethods,
		})
		//Add default shipping method for the location
		shipping.selectedShippingMethod[name] = shippingMethods[0].id
		//Create list of products grouped by location
		shipping.orderLocations[name] = {
			products: {},
			shipping: {
				options: {
					[`${shippingMethods[0].value}`]: {
						label: shippingMethods[0].description,
						value: shippingMethods[0].value,
					},
				},
				skus: locationProducts.map(product => product.sku),
				service,
			},
		}
		locationItems.forEach(item => {
			shipping.orderLocations[name].products[item] = {}
			shipping.orderLocations[name].products[item] = products[item]
		})
		//Add to option count
		optionCount += shippingMethods.length
	}
	return shipping
}

// Get an array of items from the same location and
// return their names in 1 comma seperated string
function joinProducts(items, products){
	return Object.values(products)
		.filter(product => items.includes(product.sku))
}

// reformat options object
function mapShipping(options, outerIndex){
	return Object.values(options).map((option, count) => {
		var {
			label,
			value,
			eta,
		} = option
		return {
			id: `method-${(outerIndex + 1) + count}`,
			description: label,
			value: toCents(value) || 0,
			addInfo: ((eta == `-NA-`) || (!eta)) ? `` : `Get it ${eta}!`,
		}
	})
}

export default shippingMethods
