import { ValidationError } from '@escaladesports/esca-api-client'
import loadProducts from './loadProducts'
import shippingMethods from './shippingMethods'
import quantityMod from './quantityMod'
import coupons from './coupons'
import storeOrder from './storeOrder'
import validateAddress from './validateAddress'


export async function postInfo({ response, info, preFetchData }) {
	console.log(`PostInfo`)

	// Get messages, and moifications from response, or set default values
	let {
		messages = { error: [], info: [] },
		modifications = [],
	} = response

	try {
		// Validate address
		await validateAddress(info)

		const products = await loadProducts(preFetchData, info.products)
		// These tasks can be run in parallel to save time
		const [
			quantityModifications,
			shipping,
			couponResponse,
		] = await Promise.all([
			quantityMod(products),
			shippingMethods(info, products),
			coupons(info, products)
		])
		if(couponResponse.message)
			messages.info.push(couponResponse.message)
		if(couponResponse.coupon)
			modifications.push(couponResponse.coupon)

		const order = await storeOrder(
			info,
			shipping.orderLocations,
			couponResponse
		)

		// Order is saved to meta to be pulled in by calcualte tax and preOrder
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
	} catch (error) {
		let genericMessage = `We're sorry – there was an issue processing your `
			+ `information. Please try again. If the problem persists, please `
			+ `contact customer service.`

		messages.error.push(
			error instanceof ValidationError ? error.message : genericMessage
		)

		return {
			...response,
			messages,
			success: false,
		}
	}
}
