const  shippingMethods = async (info, products, callback) => {
	//Get shipping quote from the API
	var shippingQuote = await callback({
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
	}
	// optionCount used to make unique shipping method IDs
	let optionCount = 0
	for (let [name, location] of Object.entries(shippingQuote)) {
		let {
			options,
			products: locationItems,
		} = location
		//Get shipping methods for the location
		let shippingMethods = mapShipping(options, optionCount)
		//Add location shipping methods
		shipping.shippingMethods.push({
			id: name,
			description: joinProductNames(locationItems, products),
			shippingMethods: shippingMethods,
		})   
		//Add default shipping method for the location
		shipping.selectedShippingMethod.push(shippingMethods[0].id)
		//Add to option count
		optionCount += shippingMethods.length
	}
	return shipping
}

// Get an array of items from the same location and 
// return their names in 1 comma seperated string
function joinProductNames(items, products){
	return Object.values(products)
		.filter(product => items.includes(product.sku))
		.map(product => product.name)
		.join()
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
			id: `shipping-${(outerIndex + 1) + count}`,
			description: label,
			value: parseInt(value.replace(/\./g, ``), 10),
			addInfo: ((eta == `-NA-`) || (!eta)) ? `` : `Get it ${eta}!`,
		}
	})
}

export default shippingMethods
