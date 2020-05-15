import ErrorReport from '../error-report'

/**
 * Posting order data along with the coupon code will initiate a second 
 * detailed set of validations for the code against the supplied order data. 
 * The service will respond telling you whether or not the coupon is valid.
 * If the coupon is valid you will also get back the value of the discount 
 * as well as any modifications to the cart required by the coupon; 
 * such as free shipping or a promotional item.
 * If the coupon is invalid the service will also respond with an error 
 * message and reason for the failure.
 */
export default async function calculateDiscount(params) {
	// To group all error reports related to this request
	ErrorReport.flush()

	// Extra info for error report if needed later
	let reportOptions = {
		tags: { action: `calculateDiscount` },
		extra: { params },
	}

	const { code, order } = params || {}
	try {
		const requestConfig = {
			method: `post`,
			url: this.endpoints.couponCalculate,
			data: {
				code,
				order,
			},
		}
		const discount = await this.apiRequest(requestConfig)
		return discount
	}
	catch(err) {
		// For HTTP error/fail responses
		if (err.response) {
			let { status, data } = err.response
			
			//Coupon not applicable
			if (status === 400) {
				return {
					errorMessage: `Coupon ${code} is invalid`,
				}
			}
			// Report non-404 service errors
			if (status !== 404) {
				reportOptions.extra.responseData = data
				ErrorReport.send(err, reportOptions)
			}
			
		}
		else {
			// Report entire error object & log message for non-HTTP errors
			ErrorReport.send(err, reportOptions)
			console.log(`coupon error: `, err)
			console.error(err.message || err)
		}

		/**
		 * Since this is a simple load request, just return empty when there are
		 * errors to keep usage more consistent/less complicated
		 */
		return []
	}
}
