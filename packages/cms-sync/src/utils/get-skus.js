export default function (baseProducts) {
	// create promises 
	const skus = []

	for (let productId in baseProducts) {
		const baseProduct = baseProducts[productId] || {}
		
		skus.push(productId)

		// variants from base product
		const { variants } = baseProduct

		for (let variantId in variants) {
			// push variant product queries
			skus.push(variantId)
		}
	}
  
	return skus
}