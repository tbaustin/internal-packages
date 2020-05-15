const quantityMod = async (products) => {
	return Object.values(products).map(product => {
		let {
			sku: id, 
			stock,
		} = product
		return {
			id: id,
			available: stock || 0,
			// location: `gainesville`,
			// location: inventory[id].locations && Object.keys(inventory[id].locations).length > 0 ? Object.keys(inventory[id].locations)[0] : ``,
		}
	})
}

export default quantityMod