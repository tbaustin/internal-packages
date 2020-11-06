import React from 'react'
import Helmet from 'react-helmet'
import { useTemplateEngine } from '../context/template-engine'


export default function SeoWidget(props) {
	const { seoDescription, seoTitle, h1Tag } = props.seoObj || {}

	const templateEngine = useTemplateEngine()
	const resolveVal = val => templateEngine.data
		? templateEngine.parse(val)
		: val

	const resolved = {
		seoTitle: resolveVal(seoTitle),
		seoDescription: resolveVal(seoDescription),
		h1Tag: resolveVal(h1Tag)
	}

	return (
		<>
			<Helmet>
				{!resolved.seoTitle ? null : <title>{resolved.seoTitle}</title>}
				{!resolved.seoDescription ? null : (
					<meta name="description" content={resolved.seoDescription} />
				)}
			</Helmet>
			{!resolved.h1Tag ? null : <h1>{resolved.h1Tag}</h1>}
		</>
	)
}
