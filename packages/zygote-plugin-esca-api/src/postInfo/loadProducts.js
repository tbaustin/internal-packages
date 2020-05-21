const  loadProducts = async (skus, products, callback) => {
	//Get coupon from the API
	let returnAsObject = true
	var response = await callback({
		fields: [`price`,`shipping`],
		...skus,
		returnAsObject,
	})
	//Add Quantity to products response
	products.forEach(product => {
		response[product.id.toUpperCase()].qty = product.quantity
	})
	
	return response
}

export default loadProducts
