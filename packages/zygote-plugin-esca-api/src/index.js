import fetch from 'isomorphic-fetch'

const preInfo = async ({ reqData }) => {
	return {
		"skus": reqData.products ? reqData.products.map(function(product) { return product.id }) : []
	}
}

const postInfo = async ({ data, reqData, apiData }) => {
	let items = data.inventory

	const quantityModifications = Object.keys(items).map(function(id) { 
		return {
			id: id,
			availble: items[id].stock || 0,
		}
	})

	let shippingMethods = {}, selectedShippingMethod = {}
	const transaction = await fetch(`https://products-test.escsportsapi.com/shipping`, { // Get packing dimensions
		method: `post`,
		body: JSON.stringify(apiData),
	})
		.then(response => response.json())
		.then(jsonBody => {
			if (jsonBody.errors) {
				throw Error(jsonBody.errors)
			}
			if (jsonBody.products && Object.keys(jsonBody.products).length > 0) {
				for (let key in jsonBody.products) {
					const item = reqData.products.find(obj => obj.id == key)
					const availble = quantityModifications.find(obj => obj.id == key).availble
					jsonBody.products[key].qty = item
						? availble < item.quantity
							? availble
							: item.quantity 
						: 0
					if (jsonBody.products[key].freight_class && !jsonBody.products[key].fc) {
						jsonBody.products[key].fc = jsonBody.products[key].freight_class 
					}
				}
				const shipping = {
					"service": "ups",
					"destination": {
						"name": reqData.infoName,
						"street1": reqData.shippingAddress1,
						"street2": reqData.shippingAddress2,
						"city": reqData.shippingCity,
						"state": reqData.shippingStateAbbr,
						"zip": reqData.shippingZip,
						"country": "US"
					},
					"products":  Object.keys(jsonBody.products)
						.filter(key => jsonBody.products[key].qty && jsonBody.products[key].qty > 0)
						.reduce((res, key) => (res[key] = jsonBody.products[key], res), {})
				}
				return fetch(`https://shipping-test.escsportsapi.com/load`, { // Get shipping cost
					method: `post`,
					body: JSON.stringify(shipping),
				})
			}
			else {
				throw Error("No products were found.")
			}
		})
		.then(response => response.json())
		//
		// Lookup cupons
		// ...WAITING...
		//
		.then(jsonBody => {
			if (jsonBody.errors) {
				throw Error(jsonBody.errors)
			}
			let standardShipping = 0
			Object.keys(jsonBody).forEach(location => {
				let methodIndex = 0, locationShippingMethods = {}
				Object.keys(jsonBody[location].options).forEach(cost => {
					locationShippingMethods[cost] = {
						id: `method-${methodIndex}`,
						description: jsonBody[location].options[cost].label,
						value: parseInt(cost.toString().replace(/\./g, ''), 10),
						addInfo: jsonBody[location].options[cost].eta,
					}
					if (methodIndex == 0) {
						standardShipping += locationShippingMethods[cost].value
						selectedShippingMethod[location] = `method-0`
					}
					methodIndex++
				})
				if (Object.keys(jsonBody).length > 1) {
					shippingMethods[location] = {
						id: location,
						description: `Pickleball paddle, Basketball`,
						shippingMethods: Object.keys(locationShippingMethods).map(ship => locationShippingMethods[ship])
					}
				}
				else {
					shippingMethods = locationShippingMethods
				}
			})
			return calculateTax({ 
				shippingAddress: reqData, 
				subtotal: reqData.totals.subtotal, 
				shipping: standardShipping,
				discount: 0,
			})
		})
		.then(tax => shippingMethods[Object.keys(shippingMethods)[0]].tax = tax)
		.catch(error => console.log('Request failed', error))

	
	return {
		success: data.inventory && shippingMethods ? true : false,
		modifications: [
			{
				id: `january-sale`,
				description: `January Sale`,
				value: -2000,
			},
			shippingMethods[Object.keys(shippingMethods)[0]].tax,
		],
		shippingMethods: Object.keys(shippingMethods).map(ship => shippingMethods[ship]),
		selectedShippingMethod: Object.keys(selectedShippingMethod).length == 1 ? selectedShippingMethod[Object.keys(selectedShippingMethod)[0]] : selectedShippingMethod,
		quantityModifications: quantityModifications,
	}
}

const preOrder = async ({ reqData }) => {

	const query = {
    "email": "customer@email.com",
    "delivery": {
      "first_name": "David",
      "last_name": "Roth",
      "street1": "20 Maple Ave.",
      "city": "San Pedro",
      "state": "CA",
      "zip": "90731",
      "country":"US"
    },
    "billing": "delivery",
    "orders": {
      "evansville": {
        "products": {
          "T1265": {
            "length": 12.0,
            "width": 7.25,
            "height": 2.76,
            "weight": 1.98,
            "fc": 85,
            "price": 5.99,
            "qty": 1
          }
        },
        "shipping": {
          "options": {
            "14.50": {
              "label": "UPS Ground",
              "value": 14.50
            }
          },
          "skus": [
            "T1265"
          ]
        },
        "taxes": 3.25,
        "discounts": {
          "CODE1": 10.00
        }
      }
    }
  };
}

const calculateTax = async ({ shippingAddress, subtotal = 0, shipping = 0, discount = 0 }) => {
	if (!shippingAddress.shippingStateAbbr) return {}
	let checkTax = {
		state: shippingAddress.shippingStateAbbr,
		subtotal: (subtotal / 100).toFixed(2),
		shipping: (shipping / 100).toFixed(2),
		discount: (discount / 100).toFixed(2),
	}

	return await fetch(`https://taxes-test.escsportsapi.com/calculate`, { // Get taxes
		method: `post`,
		body: JSON.stringify(checkTax),
	})
		.then(response => response.json())
		.then(jsonBody => {
			if (jsonBody.errors) {
				throw Error(jsonBody.errors)
			}
			return {
				id: `tax`,
				description: jsonBody.tax.label,
				value: parseInt(jsonBody.tax.value.toString().replace(/\./g, ''), 10),
			}
		})
		.catch(error => console.log('Failed to calculate taxes', error))
}

export { preInfo, postInfo, calculateTax }