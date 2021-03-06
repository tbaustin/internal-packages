import React from 'react'
import axios from 'axios'
import { css } from '@emotion/core'

import { powerReviews } from 'config'
import Stars from '../components/stars'
import { colors } from '../styles/variables'
import usePromise from '../hooks/usePromise'

export default function ReviewSnippetWidget(props){
	const { sku } = props
	if(!sku || !sku.length) {
		return <div>Loading...</div>
	}

	const { merchantId, apiKey } = powerReviews
	const baseUrl = `https://readservices-b2c.powerreviews.com/m/${merchantId}/l/en_US/product/${sku.toUpperCase()}/snippet`
	const params = `?apikey=${apiKey}`
	const url = `${baseUrl}${params}`
	
	const loadReview = async () => await axios.get(url)

	const [response, error, pending] = usePromise(loadReview, {})
  
	if(pending) {
		return <div>Loading...</div>
	}

	if(error) {
		console.log(`Error: `, error)
		return <div>Error fetching rating...</div>
	}

	const { data } = response
	const rating = data?.results?.[0]?.rollup?.average_rating || 0

	return (
		<div css={styles} className="reviewSnippetWidget">
			<span className={`rating`}>
				{rating ? rating : `No Reviews`}
			</span>
			<Stars rating={rating} />
		</div>
	)
}

const styles = css`
  display: flex;
  align-items: center;
  .rating {
    margin-right: 10px;
  }
  .star {
    height: 25px;
    width: 25px;
		color: ${colors.red};
  }
`