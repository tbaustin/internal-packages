import axios from 'axios'
import { powerReviews } from 'config'

const { merchantId, apiKey } = powerReviews

export default async (sku) => {
	if(!sku || !sku.length) {
		return null
	}
	
	const baseUrl = `https://readservices-b2c.powerreviews.com`
	const url = `${baseUrl}/m/${merchantId}/l/en_US/product/${sku}/questions?apikey=${apiKey}`
	let questions = []

	try {
		const { data } = await axios.get(url)
  
		if(!data) {
			throw Error(`No Reviews Fetched`)
		}
		const results = data?.results
		const paging = data?.paging
  
		const {  
			pages_total, 
			next_page_url, 
			current_page_number, 
		} = paging || {}

		let totalPages = pages_total
		let currentPage = current_page_number
		let nextUrl = next_page_url


		if(results){
			questions = results
		}
		while(currentPage < totalPages) {
			const { data: nextData } = await axios.get(`${baseUrl}${nextUrl}&apikey=${apiKey}`)
			if(!nextData) {
				throw Error(`No Reviews Fetched on page: ${currentPage}`)
			}

			totalPages = nextData?.paging?.pages_total
			currentPage = nextData?.paging?.current_page_number
			nextUrl = nextData?.paging?.next_page_url

			const nextResults = nextData?.results
    
			if(nextResults){
				questions = [...questions, ...nextResults]
			}
		}
  
		return { allQuestions: questions, ...data }
	} catch(e) {
		throw Error(e)
	}
}