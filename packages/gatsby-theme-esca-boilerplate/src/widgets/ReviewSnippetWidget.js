import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { css } from '@emotion/core'

import { powerReviews } from 'config'
import Stars from '../components/stars'
import { colors } from '../styles/variables'

export default function ReviewSnippetWidget(props){
	const { sku } = props
	const { merchantId, apiKey } = powerReviews

	const [rating, setRating] = useState(null)

	useEffect(() => {
		const loadReview = async () => {
			const url = `https://readservices-b2c.powerreviews.com/m/${merchantId}/l/en_US/product/B8400W/snippet?apikey=${apiKey}`
			const { data } = await axios.get(url)
			const averageRating = data?.results?.[0]?.rollup?.average_rating
			if(averageRating){
				setRating(averageRating)
			} else {
				setRating(0)
			}
		}
    
		loadReview()
	}, [])
  
	if(rating === null) {
		return <div>Loading...</div>
	}

	return (
		<div css={styles}>
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