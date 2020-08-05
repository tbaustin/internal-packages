import React from 'react'
import { css } from '@emotion/core'


export default function ColorBoxWidget(props) {
	const { text, color } = props

	const style = css`
    width: 200px;
    height: 200px;
    margin: 1rem;

    display: flex;
    align-items: center;
    justify-content: center;

    background: ${color};
  `

	return (
		<div css={style}>
			{text}
		</div>
	)
}
