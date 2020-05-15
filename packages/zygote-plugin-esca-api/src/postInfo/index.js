import EscaAPIClient from '@escaladesports/esca-api-client'
import loadProducts from './loadProducts'
import shippingMethods from './shippingMethods'
import quantityMod from './quantityMod'
import coupons from './coupons'

const postInfo = async ({ response, info, preFetchData }) => {
	console.log(`PostInfo`)
	const client = new EscaAPIClient()

	let {
		messages = { error: [], info: [] },
		modifications = [],
	} = response

	const products = await loadProducts(preFetchData, info.products, client.loadProducts)
	console.log(`Products: `, products)
	const quantityModifications = await quantityMod(products)
	const shipping = await shippingMethods(info, products, client.shippingQuote)

	//Calculate Coupon
	if(info.coupon) {
		const couponResponse = await coupons(info, products, client.calculateDiscount)
		if(couponResponse.message)
			messages.info.push(couponResponse.message)
		if(couponResponse.coupon)
			modifications.push(couponResponse.coupon)
	}

	const res = {
		...response,
		messages,
		modifications,
		quantityModifications,
		...shipping,
		success: true,
	}
	console.log(`Post Info Response: `, res)
	return res
}

export { postInfo }