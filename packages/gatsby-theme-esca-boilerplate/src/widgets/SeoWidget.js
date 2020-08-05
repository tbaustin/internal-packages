import React from 'react'
import Helmet from 'react-helmet'

import { useTemplateEngine } from '../context/template-engine'

export default function SeoWidget(props) {
	const {
		seoDescription,
		seoTitle,
		h1Tag,
		templateVariable = `` } = props

	const templateEngine = useTemplateEngine()
	const templateValue = templateEngine.resolveProperty(templateVariable)

	return (
		<>
			<Helmet>
				<title>{templateValue?.seoTitle || seoTitle}</title>
				<meta name="description" content={templateValue?.seoDescription || seoDescription} />
			</Helmet>
			{(templateValue?.h1Tag || h1Tag) && <h1>{templateValue?.h1Tag || h1Tag}</h1>}
		</>
	)
}
