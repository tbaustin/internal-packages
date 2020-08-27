const axios = require(`axios`)
const dirs = require(`@escaladesports/boilerplate/dirs`)
const siteConfig = require(`${dirs.site}/config`)

const {
	powerReviews: {
		merchantId,
		apiKey,
	},
} =  siteConfig


module.exports = async function() {
	const reviews = []
	if (!apiKey || !merchantId) return reviews

	const baseUrl = `https://readservices-b2c.powerreviews.com`
	const defaultUrl = `${baseUrl}/m/${merchantId}/reviews?apikey=${apiKey}`

	const loadPage = async (url) => {
		const res = await axios({
			method: `GET`,
			url: url || defaultUrl,
		})

		const { data } = res || {}
		if (!data) return

		const { results, paging } = data
		const result = results && results[0]
		const { reviews: loadedReviews } = result || {}

		if (loadedReviews && loadedReviews.length) {
			reviews.push(...loadedReviews)
		}

		const {
			pages_total,
			next_page_url,
			current_page_number,
		} = paging || {}

		if (current_page_number < pages_total) {
			await loadPage(`${baseUrl}${next_page_url}&apikey=${apiKey}`)
		}
	}

  try {
		await loadPage()
	}
	catch(err) {
		console.log(`There was a problem fetching PowerReviews data.`)
	}

	return reviews
}
