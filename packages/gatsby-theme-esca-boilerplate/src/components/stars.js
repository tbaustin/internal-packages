import React from 'react'
import { MdStarBorder, MdStarHalf, MdStar} from 'react-icons/md'

export default function Stars(props) {
	const { rating } = props
	
	const numFilled = Math.floor(rating)
	const numEmpty = Math.floor(5 - rating)
	const hasPartial = numFilled + numEmpty !== 5

	return (
		<div className="starContainer">
			{Array(numFilled).fill().map((_, i) => (
				<MdStar key={`filled-star-${i}`} className="star" />
			))}
			{hasPartial && <MdStarHalf className="star" />}
			{Array(numEmpty).fill().map((_, i) => (
				<MdStarBorder key={`empty-star-${i}`} className="star" />
			))}
		</div>
	)
}
