import React from 'react'
import { css } from '@emotion/core'
import sanitize from 'sanitize-html'
import { useTemplateEngine } from '../context/template-engine'

const style = css`
	width: 100%;
`

export default function CustomHTMLWidget(props) {
	const { html: htmlProp, templateVariable = `` } = props
	const templateEngine = useTemplateEngine()
	const templateValue = templateEngine.resolveProperty(templateVariable)

	const __html = sanitize(templateValue || htmlProp || ``)

	return (
		<div
			css={style}
			dangerouslySetInnerHTML={{ __html }}
		/>
	)
}
