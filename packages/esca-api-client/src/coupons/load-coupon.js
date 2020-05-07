import ErrorReport from '../error-report'

/**
 * Use this end point to load an object containing all data 
 * related to the supplied coupon code.
 */
export default async function loadCoupon(params) {
	// To group all error reports related to this request
	ErrorReport.flush()

	// Extra info for error report if needed later
	let reportOptions = {
		tags: { action: `loadCoupon` },
		extra: { params },
	}

	try {
		const { code } = params || {}

		const requestConfig = {
			method: `post`,
			url: this.endpoints.coupon,
			data: {
				code,
			},
		}
		const coupon = await this.apiRequest(requestConfig)
		return coupon
	}
	catch(err) {
		// For HTTP error/fail responses
		if (err.response) {
			let { status, data } = err.response

			// Report non-404 service errors
			if (status !== 404) {
				reportOptions.extra.responseData = data
				ErrorReport.send(err, reportOptions)
			}

			// Log just the HTTP response
			console.error(data)
		}
		else {
			// Report entire error object & log message for non-HTTP errors
			ErrorReport.send(err, reportOptions)
			console.error(err.message || err)
		}

		/**
		 * Since this is a simple load request, just return empty when there are
		 * errors to keep usage more consistent/less complicated
		 */
		return []
	}
}
