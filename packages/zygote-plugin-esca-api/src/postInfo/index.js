import EscaAPIClient from '@escaladesports/esca-api-client'
import loadProducts from './loadProducts'
import shippingMethods from './shippingMethods'
import quantityMod from './quantityMod'
import coupons from './coupons'
import storeOrder from './storeOrder'
import calculateTax from './calculateTax'

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
	console.log(`Products: `,products)
	//These tasks can be run in parallel to save time
	const [
		quantityModifications, 
		shipping,
		couponResponse,
	] = await Promise.all([
		quantityMod(products),
		shippingMethods(info, products, client.shippingQuote),
		coupons(info, products, client.calculateDiscount),
	])
	if(couponResponse.message)
		messages.info.push(couponResponse.message)
	if(couponResponse.coupon)
		modifications.push(couponResponse.coupon)

	const order = await storeOrder(info, shipping.orderLocations, couponResponse, client.storeOrder)
	const taxes = await calculateTax(order, client.calculateTaxes)
	Object.values(taxes).forEach(tax => {
		modifications.push({
			id: `tax`,
			description: tax.label,
			value: tax.value,
		})
	})
	
	// shippingState.subscriptions[`postinfo`](() => console.log(`Shipping Changed Triggered!!!`))
	const res = {
		...response,
		messages,
		modifications,
		quantityModifications,
		shippingMethods: shipping.shippingMethods,
		selectedShippingMethod: shipping.selectedShippingMethod,
		success: true,
		meta: order,
	}
	console.log(`Post Info Response: `, res)
	return res
}

export { postInfo }