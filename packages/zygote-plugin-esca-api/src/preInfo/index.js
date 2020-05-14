export const preInfo = async ({ info }) => {

	console.log(`preInfo`)
	console.log(info)
	return {
		skus: info.products ? info.products.map(function(product) { return product.id }) : [],
	}
}