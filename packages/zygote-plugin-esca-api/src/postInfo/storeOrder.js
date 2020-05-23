import { toDollars } from '@escaladesports/utils'


const  storeOrder = async (info, orderLocations, { coupon }, callback) => {
	//Get list of products grouped by location
	let discounts = {}
	if(coupon) {
		discounts = {
			[`${coupon.id}`]: coupon.value,
		}
	}
	//store the order
	let orderRequest = {
		order: {
			email: info.infoEmail,
			delivery: {
				first_name: info.infoFirstName,
				last_name: info.infoLastName,
				company: info.shippingCompany,
				street1: info.shippingAddress1,
				street2: info.shippingAddress2,
				city: info.shippingCity,
				state: info.shippingStateAbbr,
				zip: info.shippingZip,
				country: `US`,
				phone: info.infoPhone,
			},
			billing: `delivery`,
			locations: orderLocations,
			discounts,
			get total() {
				let orderTotal = Object.values(this.locations).reduce((locationTotal, currentLocation) => {
					let productTotal = Object.values(currentLocation.products).reduce((prodTotal, currentProd) => {
						return prodTotal + (currentProd.price * currentProd.qty)
					}, 0)
					let shippingTotal = Object.values(currentLocation.shipping.options).reduce((shipTotal, currentShip) => {
						return shipTotal + currentShip.value
					}, 0)
					return locationTotal + productTotal + shippingTotal
				}, 0)
				let discountTotal = Object.values(this.discounts).reduce((disTotal, currentDis) => disTotal + currentDis, 0)
				return orderTotal + toDollars(discountTotal)
			},
		},
	}
	var {
		order_id: orderIds,
		bind_id,
	} = await callback(orderRequest)
	//Add bind id into the order to keep orders linked on future requests
	orderRequest.order.bind_id = bind_id
	//Add order id's into the order object
	orderIds.forEach(element => {
		let [location, orderId] = Object.entries(element)[0]
		orderRequest.order.locations[location].order_id = orderId
	})

	return {
		orderRequest,
		orderIds,
	}
}


export default storeOrder
