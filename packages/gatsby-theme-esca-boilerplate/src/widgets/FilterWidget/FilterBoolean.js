import React, { useState } from 'react'
import { css } from '@emotion/core'
import produce from 'immer'
import { MdClose } from 'react-icons/md'
import { colors, breakpoints } from '../../styles/variables'


export default function FilterBoolean(props){
	const { title, label, activeFilters, setActiveFilters } = props

	const [checked, setChecked] = useState(false)

	const handleCheck = e => {
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
	}

	return (
		<div css={styles}>
			<div className="toggle">
				<input
					type="checkbox"
					checked={checked}
					onChange={handleCheck}
				/>
				{label || ``}
			</div>
			{title in activeFilters && (
				<MdClose
					className="remove"
					onClick={() => {
						setChecked(false)
						const activeFiltersCopy = produce(activeFilters, draft => {
							delete draft[title]
						})
						setActiveFilters(activeFiltersCopy)
					}}
				/>
			)}
		</div>
	)
}

const styles = css`
	margin-bottom: 20px;
	display: flex;
	align-items: center;

	.remove {
		cursor: pointer;
		width: 1.5em;
		height: 1.5em;
		margin-right: 1rem;

		@media(${breakpoints.laptop}) {
			width: 1em;
			height: 1em;
			margin-right: 0;
		}
	}
	.toggle {
		flex: 1;
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
