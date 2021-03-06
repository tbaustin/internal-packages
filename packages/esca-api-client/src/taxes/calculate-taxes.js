import ErrorReport from '../error-report'

/**
 * The primary function of this service is to calculate taxes 
 * for a set of totals based on the customer's delivery state.
 * 
 * Use this end point to calculate the taxes due for a set of monetary totals.
 */
export default async function calculateTaxes(params) {
	// To group all error reports related to this request
	ErrorReport.flush()

	// Extra info for error report if needed later
	let reportOptions = {
		tags: { action: `calculateTaxes` },
		extra: { params },
	}

	try {
		const { src, action, trans_id, order } = params || {}
		const requestConfig = {
			method: `post`,
			url: this.endpoints.taxes,
			data: {
				src,
				action,
				trans_id,
				order,
			},
		}
		const taxes = await this.apiRequest(requestConfig, `tax`)
		return taxes
	}
	catch(err) {
		console.log(`Error: `, err)
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
		return {}
	}
}
