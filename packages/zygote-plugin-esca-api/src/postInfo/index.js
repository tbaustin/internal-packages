import EscaAPIClient from '@escaladesports/esca-api-client'
import loadProducts from './loadProducts'
import shippingMethods from './shippingMethods'
import quantityMod from './quantityMod'
import coupons from './coupons'
import storeOrder from './storeOrder'
import validateAddress from './validateAddress'

const postInfo = async ({ response, info, preFetchData }) => {
	console.log(`PostInfo`)
	const client = new EscaAPIClient()

	// Get messages, and moifications from response, or set default values
	let {
		messages = { error: [], info: [] },
		modifications = [],
	} = response

	try {
		//validate address
		await validateAddress(info, client.validateAddress)

		const products = await loadProducts(preFetchData, info.products, client.loadProducts)
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
		//Order is saved to meta to be pulled in by calcualte tax and preOrder
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
		messages.error.push(error.message)
		return {
			...response,
			messages,
			success: false,
		}
	}

}

export { postInfo }
