import axios from 'axios'
import _get from 'lodash/get'
import ErrorReport from './error-report'


let tries = 0


export default async function apiRequest(options, dataPath) {
	console.log("MODIFIED API REQUEST IN CLIENT")
	tries++
	// Generic error to throw later if needed
	const genericError = new Error(`API request failed`)

	// Add in headers for final Axios request
	const axiosOptions = {
		...options,
		headers: options.headers || this.headers,
	}

	// Base set of options for error reporting if needed
	let reportOptions = {
		tags: { action: `apiRequest` },
		extra: {
			request: JSON.stringify(axiosOptions),
		},
	}

	try {
		let axiosResult = await axios(axiosOptions)
		let responseBody = axiosResult?.data || {}

		// Get nested property from response data at requested path
		if (typeof responseBody === `object`) {
			let output = dataPath ? _get(responseBody, dataPath) : responseBody
			tries = 0 // reset tries for next unique request
			return output
		}

		// Response is likely a string containing Python error
		throw axiosResult
	}
	catch(err) {
		let { response } = err || {}
		let { data } = response || {}

		/**
     * If response body is still a string, Axios wasn't able to parse JSON - so
     * it's most likely a Python error thrown within the service
     *
     * This could contain more sensitive info, so send report instead of logging
     * to console & throw a generic error
     */
		if (typeof data === `string`) {
			let isTimedOut = data.toLowerCase().includes(`timed out`)
			if (isTimedOut && tries < 3) {
				return apiRequest(options, dataPath)
			}
			/**
       * Add in the original error object to extra data for report
       * (generic error is getting sent in case a string has been caught)
       */
			reportOptions.extra.errorObject = err
			ErrorReport.send(genericError, reportOptions)
			throw genericError
		}

		/**
     * If the caught error is an object but doesn't have a response property,
     * there was some kind of network/timeout/other error
     *
     * Report this and throw the generic error
     */
		if (!response) {
			ErrorReport.send(err, reportOptions)
			throw genericError
		}

		// Re-throw any other error to be handled by higher-level functions
		throw err
	}
}
