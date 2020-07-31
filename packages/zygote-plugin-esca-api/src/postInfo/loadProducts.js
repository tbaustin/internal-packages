const  loadProducts = async (skus, products, callback) => {
	//Get coupon from the API
	let returnAsObject = true
	var response = await callback({
		fields: [`inventory`,`price`,`shipping`],
		...skus,
		returnAsObject,
	})
	//Add Quantity to products response
	products.forEach(product => {
		const sku = product.id.toUpperCase()
		response[sku].qty = product.quantity
		//find location with most quantity or default to 1st
		const locations = Object.entries(response[sku].all_stocks)
		const itemLocation = locations.reduce((location, currentLocation) => {
			const [, val] = location
			const [, curVal] = currentLocation
			if(curVal > val) return currentLocation
			return location
		}, locations[0])

		const [name, val] = itemLocation
		response[sku].location = {
			[name]: val,
		}
	})
	
	return response
}

export default loadProducts
