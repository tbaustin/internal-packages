import { centsToDollars } from '../utils/helpers'


const  storeOrder = async (info, orderLocations, { coupon }, callback) => {
	//Get list of products grouped by location
	let discounts = {}
	if(coupon) {
		discounts = {
			[`${coupon.id}`]: coupon.value,
		}
	}
	//store the order
	let order = {
		bind_id: `123`,
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
			return orderTotal + centsToDollars(discountTotal)
		},
	}
	var {
		order_id: orderIds,
	} = await callback(order)

	return {
		order,
		orderIds,
	}
}


export default storeOrder
