import React from 'react'
import { css } from '@emotion/core'
import { MdClose } from 'react-icons/md'
import Stars from '../../components/stars'
import { colors, breakpoints } from '../../styles/variables'


const ratings = [4, 3, 2, 1]


export default function FilterRating(props){
	const { title, activeFilters, setActiveFilters } = props

	const handleRemove = e => {
		e.stopPropagation()
		const newActiveFilters = { ...activeFilters }
		delete newActiveFilters[title]
		setActiveFilters(newActiveFilters)
	}

	return (
		<div css={styles}>
			<div className="ratings">
				{ratings.map((rating, i) => {
					const handleSelect = () => {
						setActiveFilters({ ...activeFilters, [title]: rating })
					}

					const isActive = activeFilters[title] === rating
					let textClassName = `text`
					if (isActive) textClassName += ` active`

					return (
						<div key={i} className="rating" onClick={handleSelect}>
							<div className={textClassName}>
								<Stars rating={rating}/> & Up
							</div>
							{isActive && (
								<MdClose className="remove" onClick={handleRemove} />
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

const styles = css`
	margin-bottom: 20px;

	.text {
		flex: 1;
		display: flex;
		align-items: center;
		font-size: 0.9rem;

		&.active {
			color: ${colors.brand};
		}
	}

	.rating {
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
	}

	.starContainer {
		margin-right: 0.5rem;
		display: flex;
    align-items: center;
	}

	.star {
		height: 20px;
		width: 20px;
	}

	.remove {
		width: 1.5em;
		height: 1.5em;
		margin-right: 1rem;
	}

	@media(${breakpoints.laptop}) {
		.rating {
			height: 2rem;
		}

		.remove {
			width: 1em;
			height: 1em;
			margin-right: 0;
		}
	}
`
