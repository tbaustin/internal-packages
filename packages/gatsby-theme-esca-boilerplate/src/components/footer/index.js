import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import SanityBlockContent from '@sanity/block-content-to-react'
import styles from './styles'
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaYoutube,
} from 'react-icons/fa'


const iconDictionary = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  pinterest: FaPinterest,
  youtube: FaYoutube
}


const footerQuery = graphql`
  query FooterQuery {
    siteSettings: sanitySiteSettings {
      _rawNavigation(resolveReferences: {maxDepth: 10})
      _rawFooterContent(resolveReferences: {maxDepth: 10})
      footerLogo {
        asset {
          url
        }
      }
      socialLinks {
        media
        link
      }
      seo {
        footerCopyrightText
      }
    }
  }
`


export default function Footer() {
  const { siteSettings } = useStaticQuery(footerQuery)

  const links = siteSettings?._rawNavigation?.footer
  const blocks = siteSettings?._rawFooterContent
  const logoSrc = siteSettings?.footerLogo?.asset?.url
  const socialLinks = siteSettings?.socialLinks

  const defaultCopyrightText = `© 2020 ESCALADE SPORTS, ALL RIGHTS RESERVED.`
  const copyrightText = (
    siteSettings?.seo?.footerCopyrightText || defaultCopyrightText
  )

  return (
    <footer css={styles}>
      <section className="top">
        <div className="info">
          {!logoSrc ? null : <img src={logoSrc} />}
          {!blocks?.length ? null : <SanityBlockContent blocks={blocks} />}
        </div>
        <div className="nav">
          {links?.map?.((link, i) => {
            const { subLinks, title, path } = link
            return (
              <div className="link-group" key={i}>
                {path
                  ?  <Link to={path} className="title">{title}</Link>
                  :  <div className="title">{title}</div>
                }
                {subLinks && subLinks.map((sLink, i2) => {
                  const { title: sTitle, path: sPath } = sLink

                  const SubLinkTag = sPath ? Link : `div`
                  const subLinkProps = {
                    key: `${i}-${i2}`,
                    className: `subtitle`,
                    ...sPath && { to: sPath }
                  }

                  return (
                    <SubLinkTag {...subLinkProps}>
                      {sTitle}
                    </SubLinkTag>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div className="social">
          {socialLinks && socialLinks.map((social, i) => {
            const { media, link } = social
            const key = `footer-social-${i}`
            const IconTag = iconDictionary[media] || FaFacebook

            return (
              <a href={link} key={key}>
                <IconTag />
              </a>
            )
          })}
        </div>
      </section>
      <section className="bottom">
        <div className="bottom-content">
          {copyrightText}
        </div>
      </section>
    </footer>
  )
}
