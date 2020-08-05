import React from 'react'
import { css } from '@emotion/core'

import CallToAction from '../components/call-to-action'
import { colors } from '../styles/variables'

export default function ButtonWidget(props) {
	const { text, link, bgColor, textColor } = props

	return (
		<div css={styles} className="buttonContainer">
			<CallToAction
				text={text}
				link={link}
				textColor={colors[textColor]}
				bgColor={colors[bgColor]}
			/>
		</div>
	)
}

const styles = css`
  margin: 50px;
  display: flex;
  justify-content: center;

`
