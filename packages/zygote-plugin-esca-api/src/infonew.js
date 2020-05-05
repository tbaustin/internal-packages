const preInfo = async ({ preFetchData, info }) => {
	return {
		skus: info.products
			? info.products.map(function (product) {
				return product.id
			})
			: [],
	}
};

const postInfo = async ({ response, info, preFetchData, cartState }) => {
	console.log(response, info, preFetchData)
};

export { preInfo, postInfo }
