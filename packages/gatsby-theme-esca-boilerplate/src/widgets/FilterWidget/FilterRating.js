import React from 'react'
import { css } from '@emotion/core'
import produce from 'immer'

import Stars from '../../components/stars'
import { colors } from '../../styles/variables'

const ratings = [4,3,2,1]

export default function FilterRating(props){
	const { title, activeFilters, setActiveFilters } = props
	
	return (
		<div css={styles}>
			<div className="title">{title}</div>
			<div className="ratings">
				{ratings.map((rating, i) => (
					<div 
						key={i}
						className="rating"
						onClick={() => {
							setActiveFilters({
								...activeFilters,
								[title]: rating,
							})
						}}  
					>
						<Stars rating={rating}/> & Up
						{activeFilters[title] === rating && (
							<div 
								className="remove" 
								onClick={(e) => {
									e.stopPropagation()

									const activeFiltersCopy = produce(activeFilters, draft => {
										delete draft[title]
									})
									setActiveFilters(activeFiltersCopy)
								}}
							>
								X
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

const styles = css`
	margin-bottom: 20px;
	.remove {
		margin-left: 20px;
	}
	.rating {
		display: flex;
		align-items: center;
		margin: 0 10px 10px 0;
		cursor: pointer;
	}
	.starContainer {
		margin-right: 10px;
		display: flex;
    align-items: center;
	}
	.star {
		height: 20px;
		width: 20px;
		color: ${colors.brand};
	}
`