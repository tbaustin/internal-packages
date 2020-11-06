import React, { useState } from 'react'
import { css } from '@emotion/core'
import { breakpoints } from '../../styles/variables'


const initialInputValues = { min: ``, max: `` }


export default function FilterRange(props){
	const {
		title,
		activeFilters,
		setActiveFilters,
		placeholderFrom,
		placeholderTo
	} = props

	const [range, setRange] = useState(initialInputValues)

	const handleInput = e => {
		const { name, value } = e.target
		setRange({ ...range, [name]: value })
	}

	const addFilter = e => {
		e.preventDefault()
		setActiveFilters({ ...activeFilters, [title]: range })
	}

	const removeFilter = () => {
		const newActiveFilters = { ...activeFilters }
		delete newActiveFilters[title]
		setActiveFilters(newActiveFilters)
		setRange(initialInputValues)
	}

	return (
		<div css={styles}>
			<div className="inputs">
				<input
					name="min"
					type="number"
					placeholder={placeholderFrom || `Min`}
					value={range.min}
					onChange={handleInput}
				/>
				<span>to</span>
				<input
					name="max"
					type="number"
					placeholder={placeholderTo || `Max`}
					value={range.max}
					onChange={handleInput}
				/>
				<button className="setPrice" onClick={addFilter}>
					Go
				</button>
			</div>
			{title in activeFilters && (
				<button className="remove" onClick={removeFilter}>
					Clear
				</button>
			)}
		</div>
	)
}


const styles = css`
	margin-bottom: 20px;

	.remove {
		margin-top: 0.75rem;
		padding: 0.5rem;
		cursor: pointer;
	}

	.inputs {
		display: flex;
		align-items: center;

		input {
			width: 4.5rem;
			padding: 0.75rem;
		}

		input, span {
			margin-right: 0.75rem;
		}
	}

	.setPrice {
		width: 4rem;
		height: 100%;
		padding: 0.75rem;
		cursor: pointer;
	}

	@media(${breakpoints.laptop}) {
		.inputs input {
			width: 4rem;
			padding: 0.5rem;
		}

		.setPrice {
			width: 3rem;
			padding: 0.5rem;
		}
	}
`
