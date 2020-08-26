import apiRequest from './api-request'
import { LoadProducts } from './products'
import { LoadShipping } from './shipping'
import { CalculateTaxes } from './taxes'
import { LoadCoupon, CalculateDiscount, ValidateCoupon } from './coupons'
import { GetOrderId, LoadOrder, StoreOrder } from './orders'
import { ValidateAddress } from './address'


export { default as ValidationError } from './validation-error'



function makeUrl(entity, action = `load`) {
	const envSuffix = this.environment === `prod` ? `` : `-test`
	const fullUrl = `https://${entity}${envSuffix}.escsportsapi.com/${action}`
	const relativeUrl = `/api/${entity}/${action}`

	if (this.devHost) return `${this.devHost}${relativeUrl}`
	return this.apiKey ? fullUrl : relativeUrl
}



export default class EscaAPIClient {
	constructor(config) {
		const {
			environment,
			endpoints,
			site,
			apiKey,
			devHost,
			taxService,
			recaptchaToken,
		} = config || {}

		// Set properties from config
		this.apiKey = apiKey
		this.environment = environment
		this.site = site
		this.devHost = devHost
		this.taxService = taxService
		this.recaptchaToken = recaptchaToken

		// Bind functions declared above as methods
		this.makeUrl = makeUrl.bind(this)
		this.apiRequest = apiRequest.bind(this)
		this.loadProducts = LoadProducts.bind(this)
		this.loadShipping = LoadShipping.bind(this)
		this.shippingQuote = LoadShipping.bind(this) // backwards-compatible alias
		this.calculateTaxes = CalculateTaxes.bind(this)
		this.loadCoupon = LoadCoupon.bind(this)
		this.calculateDiscount = CalculateDiscount.bind(this)
		this.validateCoupon = ValidateCoupon.bind(this)
		this.getOrderId = GetOrderId.bind(this)
		this.loadOrder = LoadOrder.bind(this)
		this.storeOrder = StoreOrder.bind(this)
		this.validateAddress = ValidateAddress.bind(this)

		// Set up default endpoints
		this.endpoints = {
			products: this.makeUrl(`products`),
			inventory: this.makeUrl(`inventory`),
			pricing: this.makeUrl(`pricing`),
			shipping: this.makeUrl(`shipping`),
			taxes: this.makeUrl(`taxes`, `calculate`),
			coupon: this.makeUrl(`coupon`),
			couponValidate: this.makeUrl(`coupon`, `validate`),
			couponCalculate: this.makeUrl(`coupon`, `calculate`),
			orderId: this.makeUrl(`orders`, `getid`),
			orderSave: this.makeUrl(`orders`, `save`),
			orderStore: this.makeUrl(`orders`, `store`),
			order: this.makeUrl(`orders`),
			addressValidate: this.makeUrl(`validate`, `address`),
		}

		// Set any custom endpoints defined in config
		for (let type in endpoints) {
			let endpoint = endpoints[type]
			// Don't use if the key is set but value is falsey
			if (endpoint) this.endpoints[type] = endpoint
		}
	}


	setRecaptchaToken = newToken => {
		if (newToken) {
			this.recaptchaToken = newToken
		}
		return this.recaptchaToken
	}


	get headers() {
		return {
			"Content-Type": `application/json`,
			...this.site ? { "ESC-API-Context": this.site } : {},
			...this.apiKey ? { "X-API-Key": this.apiKey } : {},
			...this.taxService ? { "ESC-Tax-Service": this.taxService } : {},
			...this.recaptchaToken ? { "Recaptcha-Token": this.recaptchaToken } : {},
		}
	}
}
