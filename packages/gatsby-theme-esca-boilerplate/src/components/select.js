import React from 'react'
import { css } from '@emotion/core'
import { inputField, variables } from '../styles'


export default function Select(props) {
	const { value, onChange, options, label } = props

	const handleChange = e => onChange(e.target.value)

	const aintNothin = !options?.length
		|| options?.length === 1
		|| options?.every(op => !op?.value)

	return aintNothin ? null : (
		<div css={styles}>
			<label>{label}</label>
			<select value={value} onChange={handleChange}>
				{options.map((option, optionIdx) => {
					const { label, value, disabled } = option
					const key = `${value}-${optionIdx}`

					if (!value && !label) return null

					return (
						<option
							key={key}
							disabled={disabled}
							value={value}
						>
							{label || value || `---- None ----`}
						</option>
					)
				})}
			</select>
		</div>
	)
}


const styles = css`
	${inputField}
  min-width: 6rem;
	margin-bottom: 20px;

	select {
		width: 100%;

		@media(${variables.breakpoints.tablet}) {
			width: fit-content;
			max-width: 20rem;
		}
	}
`
