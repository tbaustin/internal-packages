import React from 'react'
import { css } from '@emotion/core'


export const DefaultSeparator = () => (
	<span>
		&nbsp;/&nbsp;
	</span>
)


export const defaultStyles = css`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row wrap;

	li {
		display: flex;
		flex-flow: row nowrap;
	}
`
