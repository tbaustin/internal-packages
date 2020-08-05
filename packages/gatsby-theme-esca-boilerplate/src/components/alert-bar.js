import React from 'react'
import { css } from '@emotion/core'
import ContentRenderer from '../widgets'
import { colors, sizes, breakpoints } from '../styles/variables'


export default function AlertBar({ content }) {
	if (!content) return null

	return <ContentRenderer css={styles} blocks={content} />
}


const styles = css`
	display: none;

	@media(${breakpoints.laptop}) {
		display: flex;
	  align-items: center;
	  justify-content: center;
	}

  height: ${sizes.alertBarHeight};
  width: 100%;
	text-align: center;

	background: ${colors.lightGrey};

	&, p, a {
		color: ${colors.textDark};
	}

	p {
		margin: 0;
	}

  strong {
    color: ${colors.red};
  }
`
