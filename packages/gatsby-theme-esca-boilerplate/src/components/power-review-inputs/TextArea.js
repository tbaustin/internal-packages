import React from 'react'
import { css } from '@emotion/core'

export default function TextArea(props){
	const { field, onChange, ...rest } = props
	return (
		<textarea
			placeholder={field?.helper_text}
			css={styles}
			rows="5"
			onChange={e => onChange(e.target.value)}
			{...rest} 
		/>
	)
}

const styles = css`
	padding: 10px;
`