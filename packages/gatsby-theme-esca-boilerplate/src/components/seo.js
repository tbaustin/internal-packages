import React from 'react'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'
import { useTemplateEngine } from '../context/template-engine'



const query = graphql`
  query {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`


const getFullMeta = config => {
	const { title, description, site, meta } = config
	const metaDescription = description || site.siteMetadata.description

	const otherMeta = [
		{
			name: `description`,
			content: metaDescription,
		},
		{
			property: `og:title`,
			content: title,
		},
		{
			property: `og:description`,
			content: metaDescription,
		},
		{
			property: `og:type`,
			content: `website`,
		},
		{
			name: `twitter:card`,
			content: `summary`,
		},
		{
			name: `twitter:creator`,
			content: site.siteMetadata.author,
		},
		{
			name: `twitter:title`,
			content: title,
		},
		{
			name: `twitter:description`,
			content: metaDescription,
		},
	]

	return otherMeta.concat(meta || [])
}


export default function SEO(props) {
  const { lang, title: titleProp } = props

  // Replace template variables in title if we're in a template
  const templateEngine = useTemplateEngine()
  const title = templateEngine?.data
    ? templateEngine.parse(titleProp)
    : titleProp

	const { site } = useStaticQuery(query)
	const fullMeta = getFullMeta({ site, ...props, title })

	return (
		<Helmet
			htmlAttributes={{ lang }}
			title={title}
			titleTemplate={`%s | ${site.siteMetadata.title}`}
			meta={fullMeta}
		/>
	)
}
