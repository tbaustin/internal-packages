import React from 'react'
import { css } from '@emotion/core'


export default function Modal(props) {
	const { active, children, noPadding } = props

	const styles = getStyles(props)

	return (
		<div css={styles}>
			{children}
		</div>
	)
}


const getStyles = props => {
	const { active, noPadding } = props

	const display = active ? `flex` : `none`
	const padding = noPadding ? `0` : `50px`

	return css`
	  display: ${display};
	  position: fixed;
	  top: 0;
	  left: 0;
		bottom: 0;
		right: 0;

	  background: rgba(0, 0, 0, .5);
	  justify-content: center;
	  align-items: flex-start;
	  z-index: 2000;
	  padding: ${padding};
	`
}
