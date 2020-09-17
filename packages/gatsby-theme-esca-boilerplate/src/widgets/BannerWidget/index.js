import React from 'react'
import BackgroundImage from 'gatsby-background-image'
import useVariableImage from './use-variable-image'
import getWrapperStyle from './styles'


const BannerImage = props => {
	const { className, fluid, header, subHeader } = props

	return !fluid ? null : (
		<div className={className}>
			<BackgroundImage className="background-image" fluid={fluid}>
				{header && <h1>{header}</h1>}
				{subHeader && <h3>{subHeader}</h3>}
			</BackgroundImage>
		</div>
	)
}


export default function BannerWidget(props) {
	const { mobileImage, desktopImage } = props
	const fullMobileImage = useVariableImage(mobileImage)
	const fullDesktopImage = useVariableImage(desktopImage)

	const mobileProps = {
		...fullMobileImage,
		css: getWrapperStyle(`mobile`, fullMobileImage)
	}

	const desktopProps = {
		header: fullDesktopImage?.header || mobileProps.header,
		subHeader: fullDesktopImage?.subHeader || mobileProps.subHeader,
		fluid: fullDesktopImage?.fluid || mobileProps.fluid,
		sizeOptions: fullDesktopImage?.sizeOptions || mobileProps.sizeOptions
	}
	desktopProps.css = getWrapperStyle(`desktop`, desktopProps)

	return (
		<>
			<BannerImage {...mobileProps} />
			<BannerImage {...desktopProps} />
		</>
	)
}
