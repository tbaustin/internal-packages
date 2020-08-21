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
	const baseUrl = `https://readservices-b2c.powerreviews.com`
	const defaultUrl = `${baseUrl}/m/${merchantId}/reviews?apikey=${apiKey}`
	const reviewData = []
  
	const getData = async (url) => {
		const res = await axios({
			method: `GET`,
			url: url || defaultUrl,
		})
    
		const { data } = res
    
		if(data){
			const results = data.results && data.results[0]
			const paging = data.paging
			const {  
				pages_total, 
				next_page_url, 
				current_page_number, 
			} = paging || {}
  
			if(results && results.reviews){
				reviewData.push(...results.reviews)
			}

			if(current_page_number < pages_total) {
				await getData(`${baseUrl}${next_page_url}&apikey=${apiKey}`)
			} else {
				return 
			}
		} else {
			return  
		}
	}
  
  
	await getData()
  
	return reviewData

}