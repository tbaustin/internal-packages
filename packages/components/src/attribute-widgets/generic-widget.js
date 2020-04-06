import React from 'react'
import { css } from '@emotion/core'

export default function GenericWidget(props) {
	const { value, onChange, options, label } = props

	const handleChange = e => onChange(e.target.value)

	const aintNothin = !options.length || options.every(op => !op.value)

	return aintNothin ? null : (
		<div css={styles}>
			<label>{label}</label>
			<select value={value} onChange={handleChange}>
				{options.map((option, optionIdx) => {
					const { value, sku } = option
					const key = `${value}-${optionIdx}`

					if (!value && !sku) return null
					return (
						<option
							key={key}
							disabled={!sku}
							value={sku}
						>
							{value || `---- None ----`}
						</option>
					)
				})}
			</select>
		</div>
	)
}


const styles = css`
	margin-bottom: 20px;

	label {
		font-size: 16px;
		margin-bottom: 3px;
	}

	label, select {
		appearance: none;
		width: 100%;
		@media(min-width: 801px) {
			max-width: 20rem;
		}
	}

	select {
		font-size: 16px;
		height: 40px;
		border-style: none;
		border-radius: 0;
		box-shadow: none;
		cursor: pointer;
		padding-left: 15px;
	}
`
