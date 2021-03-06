import React from 'react'
import { Link } from 'gatsby'
import sanitize from 'sanitize-html'
import BackgroundImage from 'gatsby-background-image'
import H1Substitute from '../../components/h1-substitute'
import useVariableImage from './use-variable-image'
import getWrapperStyles, { htmlStyles } from './styles'


const getSafeHTML = html => {
	if (!html) return ``
	const allowedTags = sanitize.defaults.allowedTags.concat([`h1`, `button`])
	const sanitizedHTML = sanitize(html, { allowedTags })
	return { __html: sanitizedHTML }
}


const BannerImage = props => {
	const { className, fluid, heading, useH1, subHeading, link, html } = props

	const WrapperElement = link ? Link : `div`
	const linkProps = link ? { to: link } : {}

	const customHTML = getSafeHTML(html)

	const Heading = useH1 ? `h1` : H1Substitute

	return !fluid ? null : (
		<WrapperElement className={className} {...linkProps}>
			<BackgroundImage className="background-image" fluid={fluid}>
				{customHTML && (
					<div css={htmlStyles} dangerouslySetInnerHTML={customHTML} />
				)}
				{heading && <Heading>{heading}</Heading>}
				{subHeading && <h3>{subHeading}</h3>}
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
