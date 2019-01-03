'use strict';

module.exports.preInfo = function(jsonBody) {
	return {
		"skus": jsonBody.products.map(function(product) { return product.id })
	}
}
