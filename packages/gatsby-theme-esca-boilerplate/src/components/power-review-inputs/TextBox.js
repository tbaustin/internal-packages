import React from 'react'
import { css } from '@emotion/core'

export default function TextBox(props){
	const { field, onChange, type, ...rest } = props
	return (
		<input
			css={styles}
			type={type || `text`}
			placeholder={field.helper_text}
			onChange={e => onChange(e.target.value)}
			{...rest} 
		/>
	)
}

const styles = css`
	padding: 10px;
`