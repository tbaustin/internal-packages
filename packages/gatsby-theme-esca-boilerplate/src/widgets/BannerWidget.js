import React from 'react'
import { getFluidGatsbyImage } from 'gatsby-source-sanity'
import { css } from '@emotion/core'
import BackgroundImage from 'gatsby-background-image'
import { useTemplateEngine } from '../context/template-engine'
import { sanityProjectId, sanityDataset } from 'config'

import { breakpoints } from '../styles/variables'


export default function BannerWidget(props) {
	const { templateVariable = ``, ...restProps } = props

	const sanityConfig = {
		projectId: sanityProjectId,
		dataset: sanityDataset,
	}

	// Try to replace template variable w/ value in case one is provided
	const templateEngine = useTemplateEngine()
	const templateValue = templateEngine.resolveProperty(templateVariable)
	const templateProps = templateValue

	const { asset, size, header, subHeader } = templateProps || restProps
	// Use asset ID derived from template variable or the "hard-coded" one
	const imageAssetId = asset?._id || asset?._ref

	// Get the Gatsby Image props for the asset ID being used
	const fluid = getFluidGatsbyImage(
		imageAssetId,
		{ maxWidth: 2000 },
		sanityConfig,
	)

	const style = css`
    width: 100%;
		.bannerBgImage {
			${sizeStyles[size] || sizeStyles.medium};
			display: flex;
			flex-flow: column nowrap;
			justify-content: center;
			align-items: center;
			padding: 0 50px;
			text-align: center;
		}
		.bannerHeader {
			font-size: 40px;
			line-height: 1;
			color: #fff;
			margin: 0 0 30px 0;
			text-transform: uppercase;
			:after {
				height: 2px;
				display: block;
				width: 180px;
				background: #fff;
				content: '';
				margin: 32px auto 0;
			}
		}
		.bannerSubHeader {
			font-size: 16px;
    	line-height: 22px;
			color: #fff;
			margin: 0 auto;
		}

		@media(${breakpoints.tablet}) {
			.bannerHeader {
				font-size: 64px;
			}
			.bannerSubHeader {
				font-size: 20px;
    		line-height: 32px;
			}
		}
		@media(${breakpoints.laptop}){
			.bannerHeader {
				font-size: 84px;
			}
			.bannerSubHeader {
				font-size: 28px;
    		line-height: 36px;
			}
		}
  `

	return !fluid ? null : (
		<div css={style}>
			<BackgroundImage className={`bannerBgImage`}  fluid={fluid}>
				<h1 className="bannerHeader">{header}</h1>
				<h3 className="bannerSubHeader">{subHeader}</h3>
			</BackgroundImage>
		</div>
	)
}


const sizeStyles = {

	short: css`
    height: 75vw;
    max-height: 33vh;
  `,
	medium: css`
    height: 100vw;
    max-height: 50vh;
  `,
	tall: css`
    height: 150vw;
    max-height: 75vh;
  `,
}
