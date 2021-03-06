import { toDollars, toCents } from '@escaladesports/utils'
import client from '../client'


export default async function storeOrder(info, orderLocations, { coupon }) {
	// store the order
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
			discounts: function() {
				return Object.values(this.locations).reduce((discountTotal, currentLocation) => {
					if(currentLocation.discounts){
						return discountTotal + Object.values(currentLocation.discounts).reduce((locationDiscountTotal, currentDiscount) => {
							return locationDiscountTotal + currentDiscount
						}, 0)
					}
					return discountTotal
				}, 0)
			},
			get total() {
				let orderTotal = Object.values(this.locations).reduce((locationTotal, currentLocation) => {
					let productTotal = Object.values(currentLocation.products).reduce((prodTotal, currentProd) => {
						return prodTotal + (currentProd.price * currentProd.qty)
					}, 0)
					let shippingTotal = Object.values(currentLocation.shipping.options).reduce((shipTotal, currentShip) => {
						return shipTotal + currentShip.value
					}, 0)
					let taxes = currentLocation.taxes ? currentLocation.taxes.value : 0
					return locationTotal + productTotal + shippingTotal + taxes
				}, 0)
				return toDollars(toCents(orderTotal) - toCents(this.discounts()))
			},
		},
	}
	//Add discounts to each location
	if(coupon) {
		//This works with AWS coupon service
		// for (const [key, value] of Object.entries(coupon.locations)) {
		// 	orderRequest.order.locations[key].discounts = {
		// 		[coupon.id]: value.discount,
		// 	}
		// }
		const firstLocation = Object.keys(orderRequest.order.locations)[0]
		orderRequest.order.locations[firstLocation].discounts = {[coupon.id]: coupon.dollarDiscount }
	}

	var {
		order_id: orderIds,
		bind_id,
	} = await client.storeOrder(orderRequest)
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
