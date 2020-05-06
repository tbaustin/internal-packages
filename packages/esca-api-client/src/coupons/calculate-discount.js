import ErrorReport from '../error-report'

/**
 * Load products request wrapped in error handling logic
 */
export default async function calculateDiscount(params) {
	// To group all error reports related to this request
	ErrorReport.flush()

	// Extra info for error report if needed later
	let reportOptions = {
		tags: { action: `calculateDiscount` },
		extra: { params },
	}

	try {
		const { code, order } = params || {}

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
