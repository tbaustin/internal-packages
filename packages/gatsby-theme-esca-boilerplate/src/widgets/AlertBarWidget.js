import React from 'react'
import { Link } from 'gatsby'
import { css } from '@emotion/core'

import SanityBlock from './index'
import { colors } from '../styles/variables'

export default function AlertBarWidget(props) {
	const { copy, link } = props
	return (
		<div css={styles}>
			<Link to={link} className={`text`}>
				<SanityBlock blocks={copy} />
			</Link>
		</div>

	)
}

const styles = css`
  position: fixed;
  top: 0;
  height: 40px;
  width: 100%;
  text-align: center;
  z-index: 2000;
  background: ${colors.lightGrey};
  a.text  {
    color: ${colors.textDark};
    text-decoration: none;
  }
`