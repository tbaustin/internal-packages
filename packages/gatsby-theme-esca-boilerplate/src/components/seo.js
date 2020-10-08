import React from 'react'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'
import { useTemplateEngine } from '../context/template-engine'

const query = graphql`
  query {
    sanitySiteSettings {
      seo {
        title
        description
        author
      }
      headerLogo {
        asset {
          url
        }
      }
    }
    site {
      siteMetadata {
        title
        description
        author
        siteUrl
      }
    }
  }
`

const getFullMeta = config => {
  const { site, title, description, meta, author, image } = config

  const otherMeta = [
    {
      name: `description`,
      content: description,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:description`,
      content: description,
    },
    {
      property: 'og:url',
      content: site.siteMetadata.siteUrl
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      property: `og:image`,
      content: image,
    },
    {
      name: `twitter:card`,
      content: `summary`,
    },
    {
      name: `twitter:creator`,
      content: author,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    {
      name: `twitter:description`,
      content: description,
    }
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

  const { sanitySiteSettings, site } = useStaticQuery(query)

  const description = sanitySiteSettings?.seo?.description
    || site?.siteMetadata?.description

  const author = sanitySiteSettings?.seo?.author
    || site?.siteMetadata?.author

  const image = sanitySiteSettings?.headerLogo?.asset?.url

  const fullMeta = getFullMeta({
    site,
    ...props,
    title,
    description,
    author,
    image
  })

  const siteTitle = sanitySiteSettings?.seo?.title
    || site?.siteMetadata?.title

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={`%s | ${siteTitle}`}
      meta={fullMeta}
    />
  )
}
