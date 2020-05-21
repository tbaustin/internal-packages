import ErrorReport from '../error-report'



/**
 * Error handling logic for load products request
 */
const controlFlow = async (loadProducts, params) => {
	// To group all error reports related to this request
	ErrorReport.flush()

	// Extra info for error report if needed later
	let reportOptions = {
		tags: { action: `loadProducts` },
		extra: { params },
	}

	try {
		const products = await loadProducts(params)
		return products
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



/**
 * The actual load products request
 */
async function loadProducts(params) {
	const { fields, salsify, skus } = params || {}

	const { byParent, groupByParent, groupby, groupBy } = params || {}
	const groupByVal = byParent || groupByParent
		? `parent`
		: (groupby || groupBy)

	const requestConfig = {
		method: `post`,
		url: this.endpoints.products,
		data: {
			fields,
			salsify,
			skus: skus || (this.site ? [`all`] : []),
			...groupByVal && { groupby: groupByVal },
		},
	}

	const products = await this.apiRequest(requestConfig, `products`)

	return Object.keys(products).map(sku => {
		const product = products[sku]
		const { salsify_data, variants: variantsObj, ...other } = product

		const salsify = JSON.parse(salsify_data || `{}`)
		const variants = Object.values(variantsObj || {})
		
		return {
			sku,
			salsify,
			...variants.length && { variants },
			...other,
		}
	})
}



/**
 * Load products request wrapped in error handling logic
 */
export default function(params) {
	return controlFlow(
		loadProducts.bind(this),
		params,
	)
}
