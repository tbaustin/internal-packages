import ErrorReport from '../error-report'
import ValidationError from '../validation-error'

/**
 * Gathers shipping quotes for a customer order
 *
 * The corresponding web service can return user-facing validation messages, so
 * this function's behavior is to either return shipping quote data or throw an
 * Error object with a message that's meaningful to the user (not return empty)
 */
export default async function LoadShipping(params) {
	// To group all error reports related to this request
	ErrorReport.flush()

	// Extra info for error report if needed later
	let reportOptions = {
		tags: { action: `loadShipping` },
		extra: { params }
	}

	try {
		const { destination, products } = params || {}

		const requestConfig = {
			method: `post`,
			url: this.endpoints.shipping,
			data: { destination, products }
		}

		const quote = await this.apiRequest(requestConfig)
		return quote
	}
	catch(err) {
		const genericError = new Error(`Could not get shipping quotes`)

		/**
		 * Since this request can return validation errors, default behavior when
		 * there's a problem should be to throw an error instead of returning empty
		 * for the sake of predictability/consistency
		 *
		 * Any non-HTTP errors encountered could be more sensitive/low-level, so
		 * report these and throw a generic error
		 */
		if (!err?.response) {
			ErrorReport.send(err, reportOptions)
			throw genericError
		}

		// Get status & payload/body from HTTP error/fail response
		let { status, data: body } = err.response

		/**
		 * The shipping quote service usually returns a 400 response with a
		 * validation message if there's a problem; treat 400 responses as
		 * validation warnings & bubble up as long as the message isn't generic
		 */
		const isValidationWarning = status === 400
			&& body?.statusCode === 400
			&& body?.errorMessage !== `Unable to get shipping quotes`

		if (isValidationWarning) {
			let message = body?.errorCode ? `Error code ${body.errorCode}: ` : ``
			message += body?.errorMessage || `Could not get shipping quotes`
			throw new ValidationError(message)
		}

		/**
		 * Otherwise, service errors that aren't 400 or contain a generic message
		 * could be more sensitive/low-level; send response in a report & throw a
		 * generic error
		 */
		reportOptions.extra.responseBody = body
		ErrorReport.send(err, reportOptions)
		throw genericError
	}
}
