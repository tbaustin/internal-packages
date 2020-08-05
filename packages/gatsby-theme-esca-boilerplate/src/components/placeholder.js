import React from 'react'
import { css } from '@emotion/core'


export default function PlaceHolder(props) {
	const { aspectRatio, children } = props
	const [ w, h ] = aspectRatio

	return (
		<div css={styles(w, h)} className="placeholder">
			{children}
		</div>
	)
}

const styles = (w, h) => css`
  &:before {
    content: '';
    float: left;
    padding-top: ${(h / w) * 100}%;
    position: relative;
  }
  &:after {
    content: '';
    display: table;
    clear: both;
  }
`