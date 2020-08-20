import axios from 'axios'
import _get from 'lodash/get'
import ErrorReport from './error-report'


let tries = 0


export default async function apiRequest(options, dataPath) {
	// Increment tries count in case of previous timeout
	tries++

	// Generic error types to throw later if needed
	const genericError = new Error(`API request failed`)
	const timedOutError = new Error(`Request timed out`)

	// Add in headers for final Axios request
	const axiosOptions = {
		...options,
		headers: options.headers || this.headers
	}

	// Base set of options for error reporting if needed
	let reportOptions = {
		tags: { action: `apiRequest` },
		extra: {
			request: JSON.stringify(axiosOptions)
		}
	}

	try {
		let axiosResult = await axios(axiosOptions)
		let responseBody = axiosResult?.data || {}

		// Return response data or inner value at requested object path (if present)
		if (typeof responseBody === `object`) {
			let output = dataPath ? _get(responseBody, dataPath) : responseBody
			tries = 0 // reset tries count for next unique request
			return output
		}

		/**
		 * If response isn't an object, it's likely a Python error string - treat
		 * the response as an error & throw to be handled below
		 */
		throw axiosResult
	}
	catch(err) {
		/**
		 * Add the originally-caught error object to extra data for the report in
		 * case we're capturing/reporting one of the generic errors
		 */
		reportOptions.extra.originalError = err

		/**
		 * Any relevant response data could be nested in 1 of 2 places depending on
		 * whether we caught an actual error ('data' under 'response') or a normal
		 * response object ('data' directly at top level)
		 */
		let data = err?.data || err?.response?.data

		/**
     * If response body is still a string, Axios wasn't able to parse JSON - so
     * it's most likely a Python error originally thrown within the service &
		 * bubbled all the way up to its response...
     *
     * This could contain more sensitive info, so send the full error in a
		 * report while re-throwing a generic error
     */
		if (typeof data === `string`) {
			/**
			 * First, check for a Python error that includes verbiage indicating that
			 * a timeout has occurred; retry the request up to 2 times if encountered
			 */
			let isTimedOut = data.toLowerCase().includes(`timed out`)
			if (isTimedOut && tries < 3) {
				console.log(
					`API request timed out. Trying ${3 - tries} more time(s)...`
				)
				return apiRequest(options, dataPath)
			}

			// Add extra timeout/retry info to the report
			reportOptions.extra.timedOut = isTimedOut
			reportOptions.extra.attempts = tries

			// Send & re-throw generic error type according to scenario
			let errorToBubble = isTimedOut ? timedOutError : genericError
			ErrorReport.send(errorToBubble, reportOptions)
			throw errorToBubble
		}

		/**
     * If the caught error is an object but doesn't have a response property,
     * there was some kind of other network/Axios error
     *
     * Report this and throw the generic error
     */
		if (!err?.response) {
			ErrorReport.send(err, reportOptions)
			throw genericError
		}

		// Re-throw any other error to be handled by higher-level functions
		throw err
	}
}
