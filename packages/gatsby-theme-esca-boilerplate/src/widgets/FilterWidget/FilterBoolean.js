import React, { useState } from 'react'
import { css } from '@emotion/core'
import produce from 'immer'

import { colors } from '../../styles/variables'

export default function FilterBoolean(props){
	const { title, activeFilters, setActiveFilters } = props

	const [checked, setChecked] = useState(false)

	return (
		<div css={styles}>
			<div className="toggle">
				<input
					type="checkbox"
					checked={checked}
					onChange={e => {
						setChecked(e.target.checked)
						if(!e.target.checked) {
							const activeFiltersCopy = produce(activeFilters, draft => {
								delete draft[title]
							})
							setActiveFilters(activeFiltersCopy)
						} else {
							setActiveFilters({
								...activeFilters,
								[title]: e.target.checked,
							})
						}
					}}
				/>
				{title in activeFilters && (
					<div
						className="remove"
						onClick={() => {
							setChecked(false)
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

		</div>
	)
}

const styles = css`
	margin-bottom: 20px;
	.remove {
		cursor: pointer;
	}
	.toggle {
		display: flex;
		align-items: center;
		input {
			margin-right: 10px;
		}
		input[type='checkbox'] {
			-webkit-appearance:none;
			width:30px;
			height:30px;
			background:white;
			border-radius:5px;
			border:2px solid #555;
			cursor: pointer;
			outline: none;
		}
		input[type='checkbox']:checked {
			background: ${colors.brand};
		}
	}
`
