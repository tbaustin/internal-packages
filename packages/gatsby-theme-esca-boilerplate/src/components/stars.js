import React from 'react'
import { MdStarBorder, MdStarHalf, MdStar} from 'react-icons/md'

export default function Stars(props) {
	const { rating } = props

	const filledStars = Math.floor(rating)
	const partialStar = rating % 1 > .4
	const emptyStars = partialStar ? Math.floor(5 - rating) : Math.ceil(5 - rating)
  
	return (
		<div className={`starContainer`}>
			{[...Array(filledStars)].map((_, i) => <MdStar className={`star`} key={i}/>)}
			{partialStar && <MdStarHalf className={`star`} />}
			{[...Array(emptyStars)].map((_, i) => <MdStarBorder className={`star`} key={i}/>)}
		</div>
	)
}