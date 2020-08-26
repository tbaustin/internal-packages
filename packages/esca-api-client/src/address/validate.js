import ErrorReport from '../error-report'



function getInvalidReason(validateAddressResponse) {
	const { reason, errorMessage, failed } = validateAddressResponse || {}
	const regex = /required|invalid/

	if (regex.test(failed)) return failed
	if (regex.test(errorMessage)) return errorMessage
	if (Array.isArray(reason) && reason[0]) return reason[0]
	if (typeof reason === `string`) return reason

	return ``
}



/**
 * Validates a given address
 * Always returns an object w/ 'valid' (Boolean) and optional 'reason' (string)
 */
export default async function validateAddress(params) {
	// To group all error reports related to this request
	ErrorReport.flush()

	// Extra info for error report if needed later
	let reportOptions = {
		tags: { action: `validateAddress` },
		extra: { params }
	}

	try {
		const { address } = params || {}

		const requestConfig = {
			method: `post`,
			url: this.endpoints.addressValidate,
			data: { address }
		}

		const response = await this.apiRequest(requestConfig)

		const valid = Boolean(response?.valid)
		const reason = getInvalidReason(response)

		return { valid, ...reason && { reason } }
	}
	catch(err) {
		/**
		 * This service is always expected to return a 200 response regardless of
		 * address validity; any caught error is more likely a lower-level problem,
		 * so send a report and return a generic invalid address result
		 *
		 * Just in case there actually is an HTTP error response (not expected),
		 * include the response body in the error report for troubleshooting
		 */
		if (err?.response) {
			reportOptions.extra.responseBody = err.response.data
		}
		ErrorReport.send(err, reportOptions)

		return {
			valid: false,
			reason: `Unable to validate address`
		}
	}
}
