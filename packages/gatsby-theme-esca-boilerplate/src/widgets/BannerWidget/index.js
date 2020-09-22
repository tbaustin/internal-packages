import React from 'react'
import { Link } from 'gatsby'
import sanitize from 'sanitize-html'
import BackgroundImage from 'gatsby-background-image'
import useVariableImage from './use-variable-image'
import getWrapperStyles, { htmlStyles } from './styles'


const getSafeHTML = html => {
	if (!html) return ``
	const allowedTags = sanitize.defaults.allowedTags.concat([`h1`, `button`])
	const sanitizedHTML = sanitize(html, { allowedTags })
	return { __html: sanitizedHTML }
}


const BannerImage = props => {
	const { className, fluid, header, subHeader, link, html } = props

	const WrapperElement = link ? Link : `div`
	const linkProps = link ? { to: link } : {}

	const customHTML = getSafeHTML(html)

	return !fluid ? null : (
		<WrapperElement className={className} {...linkProps}>
			<BackgroundImage className="background-image" fluid={fluid}>
				{customHTML && (
					<div css={htmlStyles} dangerouslySetInnerHTML={customHTML} />
				)}
				{header && <h1>{header}</h1>}
				{subHeader && <h3>{subHeader}</h3>}
			</BackgroundImage>
		</WrapperElement>
	)
}


export default function BannerWidget(props) {
	const { mobileImage, desktopImage, ...restProps } = props
	const fullMobileImage = useVariableImage(mobileImage)
	const fullDesktopImage = useVariableImage(desktopImage)

	const mobileProps = {
		...fullMobileImage,
		css: getWrapperStyles(`mobile`, fullMobileImage)
	}

	const desktopProps = fullDesktopImage?.fluid
		? fullDesktopImage
		: fullMobileImage

	desktopProps.css = getWrapperStyles(`desktop`, desktopProps)

	return (
		<>
			<BannerImage {...mobileProps} {...restProps} />
			<BannerImage {...desktopProps} {...restProps} />
		</>
	)
}
