import EscaAPIClient from '@escaladesports/esca-api-client'
import loadProducts from './loadProducts'
import shippingMethods from './shippingMethods'
import quantityMod from './quantityMod'
import coupons from './coupons'
import storeOrder from './storeOrder'

const postInfo = async ({ response, info, preFetchData }) => {
	console.log(`PostInfo`)
	const client = new EscaAPIClient()

	// const {
	// 	productsState,
	// 	customerState,
	// 	totalsState,
	// 	shippingState,
	// 	findShippingMethod
	// } = cartState

	// Get messages, and moifications from response, or set default values
	let {
		messages = { error: [], info: [] },
		modifications = [],
	} = response

	const products = await loadProducts(preFetchData, info.products, client.loadProducts)
	console.log(`Products: `, products)
	const quantityModifications = await quantityMod(products)
	const shipping = await shippingMethods(info, products, client.shippingQuote)
	//Calculate Coupon
	const couponResponse = await coupons(info, products, client.calculateDiscount)
	if(couponResponse.message)
		messages.info.push(couponResponse.message)
	if(couponResponse.coupon)
		modifications.push(couponResponse.coupon)

	const order = await storeOrder(info, shipping.orderLocations, couponResponse, client.storeOrder)
	console.log(`Order: `, order)
	console.log(`Order Total:`, order.order.total)

	modifications.push({
		id: `tax`,
		description: `Michigan Tax`,
		value: parseInt(10),
	})
	const res = {
		...response,
		messages,
		modifications,
		quantityModifications,
		shippingMethods: shipping.shippingMethods,
		selectedShippingMethod: shipping.selectedShippingMethod,
		success: true,
	}
	console.log(`Post Info Response: `, res)
	return res
}

export { postInfo }