const quantityMod = async (products) => {
	return Object.values(products).map(product => {
		let {
			sku: id, 
			stock,
		} = product
		return {
			id: id,
			available: stock || 0,
		}
	})
}

export default quantityMod