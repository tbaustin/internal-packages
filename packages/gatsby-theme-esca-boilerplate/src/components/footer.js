import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import { css } from '@emotion/core'
import {
	FaFacebook,
	FaTwitter,
	FaInstagram,
	FaPinterest,
	FaYoutube,
} from 'react-icons/fa'
import SanityBlockContent from '@sanity/block-content-to-react'

import { runningSection } from '../styles'
import { breakpoints, colors, screenWidths } from '../styles/variables'


export default function Footer() {
	const { siteSettings } = useStaticQuery(graphql`
	  query FooterQuery {
	    siteSettings: sanitySiteSettings {
				_rawNavigation(resolveReferences: {maxDepth: 10})
				_rawFooterContent(resolveReferences: {maxDepth: 10})
        socialLinks {
          media
          link
          image {
            asset {
              fluid(maxWidth: 100) {
                src
              }
            }
          }
        }
        seo {
          footerCopyrightText
        }
			}
	  }
  `)

	function renderIcon(media){
		switch (media) {
			case `facebook`:
				return <FaFacebook />
			case `twitter`:
				return <FaTwitter />
			case `instagram`:
				return <FaInstagram />
			case `pinterest`:
				return <FaPinterest />
			case `youtube`:
				return <FaYoutube />
			default:
				return <FaFacebook />
		}
	}

	const links = siteSettings?._rawNavigation?.footer
	const blocks = siteSettings?._rawFooterContent
  const socialLinks = siteSettings?.socialLinks
  const copyrightText = siteSettings?.seo?.footerCopyrightText || `© 2020 ESCALADE SPORTS, ALL RIGHTS RESERVED.`

	const renderSocial = (platform) => {
		return (
			<div className={`block social ${platform}`}>
				<ul className="socialLinks">
					{socialLinks && socialLinks.map((social, i) => {
						const { media, link } = social
						return (
							<li key={i}>
								<a href={link}>
									{renderIcon(media)}
								</a>
							</li>
						)
					})}
				</ul>
			</div>
		)
	}

	return (
		<footer css={styles}>
			<div className="footerContainer">
				<div className="block copy">
					<SanityBlockContent blocks={blocks} />
				</div>
				<div className="block nav">
					<ul className="mainLinks">
						{links?.map?.((link, i) => {
							const { subLinks, title, path } = link
							return (
								<li
									key={i}
								>
									{path
										?  <Link to={path} className={`title`}>{title}</Link>
										:  <div className={`title`}>{title}</div>
									}
									{subLinks && (
										<ul className="subLinks">
											{subLinks.map((sLink, i2) => {
												const { title: sTitle, path: sPath } = sLink
												return (
													<li
														key={`${i}-${i2}`}
													>
														{sPath
															?  <Link to={sPath} className={`sTitle`}>{sTitle}</Link>
															:  <div className={`sTitle`}>{sTitle}</div>
														}
													</li>
												)
											})}
										</ul>
									)}
								</li>
							)
						})}
						{renderSocial(`desktop`)}
					</ul>
				</div>
				{renderSocial(`mobile`)}
			</div>
			<div className="copyRight">
        {copyrightText}
			</div>
		</footer>
	)
}


const styles = css`
  ${runningSection}
  align-items: flex-start;
  padding: 30px 40px 0px 30px;
  background-color: ${colors.navMedium};
  box-sizing: border-box;
	flex-flow: row wrap;
	.desktop {
		display: none;
	}
  a {
    text-decoration: none;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .copyRight {
    flex: 1 0 100%;
    background: ${colors.navDark};
    margin: 50px -40px auto -40px;
    padding: 30px 60px;
    color: ${colors.textMedium};
    border-top: 1px solid ${colors.textMedium};
  }
  .footerContainer {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
		flex: 1;
		max-width: ${screenWidths.desktop};
  }
  .block {
		flex-basis: 100%;
    text-align: center;
		figure {
			margin: 0;
			display: block;
		}
    margin: 40px 0;
	}
  .copy {
    text-align: left;
    max-width: 500px;
    img {
      max-width: 320px;
    }
    p {
      line-height: 26px;
			color: ${colors.textLight};
    }
  }
  .mainLinks {
    display: flex;
    justify-content: space-evenly;
    .title {
      text-transform: uppercase;
      font-size: 20px;
      margin-bottom: 30px;
      font-weight: bolder;
			color: ${colors.textLight};
    }
  }
  .subLinks {
    display: flex;
    flex-flow: column nowrap;
    > li {
      margin: 8px 0;
    }
    .sTitle {
      color: ${colors.textMedium};
    }
  }
  .socialLinks {
    display: flex;
    justify-content: space-between;
    max-width: 320px;
    margin: 0 auto;
    svg {
      height: 20px;
      width: 20px;
			color: ${colors.textMedium};
    }
  }
  .social {
    margin: 0 auto;
  }
  @media(${breakpoints.tablet}){
    .block {
      flex-basis: calc(50% - 20px);
    }
	}
	@media(${breakpoints.laptop}){
		.mainLinks {
			flex-flow: row wrap;
		}
		.mobile {
			display: none;
		}
		.desktop {
			display: block;
		}
		.social {
			margin: 40px 0;
			margin-left: auto;
		}
	}
`
