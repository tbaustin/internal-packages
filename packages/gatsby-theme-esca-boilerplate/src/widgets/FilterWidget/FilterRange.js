import React, { useState } from 'react'
import { css } from '@emotion/core'
import produce from 'immer'

export default function FilterRange(props){
	const {
		title,
		activeFilters,
		setActiveFilters,
		placeholderFrom,
		placeholderTo
	} = props

	const [range, setRange] = useState({ min: `0`, max: `0` })

	function addFilter(e) {
		e.preventDefault()
		setActiveFilters({
			...activeFilters,
			[title]: range,
		})
	}

	const removeFilter = () => {
		const activeFiltersCopy = produce(activeFilters, draft => {
			delete draft[title]
		})
		setActiveFilters(activeFiltersCopy)
	}

	return (
		<div css={styles}>
			<div className="inputs">
				<div className="min">
					<input
						type="number"
						placeholder={placeholderFrom || `Min`}
						value={range.min}
						onChange={e => setRange({...range, min: e.target.value})}
					/>
				</div>
				to
				<div className="max">
					<input
						type="number"
						placeholder={placeholderTo || `Max`}
						value={range.max}
						onChange={e => setRange({...range, max: e.target.value})}
					/>
				</div>
				<div className="setPrice">
					<button onClick={addFilter}>Go</button>
				</div>
			</div>
			{title in activeFilters && (
				<div className="remove">
					<button onClick={removeFilter}>
						Remove
					</button>
				</div>
			)}
		</div>
	)
}

const styles = css`
	margin-bottom: 20px;
	.remove {
		margin: 10px;
		display: flex;
		justify-content: center;
		button {
			outline: none;
			cursor: pointer;
		}
	}
	.inputs {
		display: flex;
		justify-content: space-evenly;
		input {
			width: 65px;
			padding: 6px;
			text-align: center;
		}
	}
	.setPrice {
		button {
			height: 100%;
			padding: 0 10px;
			cursor: pointer;
		}
	}
`
