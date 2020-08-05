import React from 'react'
import { css } from '@emotion/core'
import { getFluidGatsbyImage } from 'gatsby-source-sanity'
import sanitize from 'sanitize-html'
import { Link } from 'gatsby'
import BackgroundImage from 'gatsby-background-image'
import Container from '../components/container'
import { useTemplateEngine } from '../context/template-engine'
import { sanityProjectId, sanityDataset } from 'config'
import SanityBlock from './index'

import { screenWidths, breakpoints, colors } from '../styles/variables'

const TileWrapper = ({ link, children, ...rest }) => {
	if(link){
		return (
			<Link to={link} {...rest}>
				{children}
			</Link>
		)
	} else {
		return (
			<div {...rest}>
				{children}
			</div>
		)
	}
}

export default function FeatureTilesWidget(props) {
	const { tiles, templateVariable = ``, title, background  } = props

	const templateEngine = useTemplateEngine()
	const templateValue = templateEngine.resolveProperty(templateVariable)

	const selectedTiles = templateValue || tiles

	const sanityConfig = {
		projectId: sanityProjectId,
		dataset: sanityDataset,
	}

	return (
		<Container width="full" css={containerStyles(background)}>
			<Container width="constrained">
				{title && <h2 css={titleStyles}>{title}</h2>}
				<ul css={style}>
					{selectedTiles?.map?.((tile, i) => {
						const { html, img, color, link, header, subHeader, size } = tile || {}
						const imageAssetId = img?.asset?._id
						const fluid = getFluidGatsbyImage(
							imageAssetId,
							{ maxWidth: 700 },
							sanityConfig,
						)

						return (
							<li key={i} css={styles}>
								<TileWrapper link={link} className={size}>
									<BackgroundImage
										fluid={fluid && fluid}
										className={`featuredBgImage`}
									>
										{color && (
											<div
												className={`overlay`}
												css={overlayStyles(color)}
											></div>
										)}
										{header && (
											<div css={headerStyles}>
												<SanityBlock {...sanityConfig} blocks={header} />
											</div>
										)}
										{subHeader && (
											<div css={subHeaderStyles}>
												<SanityBlock {...sanityConfig} blocks={subHeader} />
											</div>
										)}
										{html && <div
											css={htmlStyles}
											dangerouslySetInnerHTML={{ __html: sanitize(html, {
												allowedTags: sanitize.defaults.allowedTags.concat([
													`h2`,

													`button`,
												]),
											})}} />}
									</BackgroundImage>
								</TileWrapper>
							</li>
						)
					})}
				</ul>
			</Container>
		</Container>
	)
}

function pickColor(background){
	switch (background) {
		case `grey`:
			return `#999`
		case `light-grey`:
			return `#e8e7e7`
		default:
			return `transparent`
	}
}

const styles = css`
	.tall {
		display: block;
		height: 400px;
	}
`

const headerStyles = css`
	img { 
		width: 75%;
    max-width: 220px;
	}
	figure {
		color: #fff;
    font: 48px/44px Roboto-Black,Helvetica,Arial,sans-serif;
    margin-bottom: 35px;
    position: relative;
    display: block;
    text-transform: uppercase;
		:after {
			content: '';
			display: block;
			width: 80px;
			height: 2px;
			background-color: #fff;
			position: absolute;
			bottom: -22px;
			left: 0;
			right: 0;
			margin: 0 auto;
		}
	}
`

const subHeaderStyles = css`
	color: #fff;
	font-size: 20px;
	line-height: 28px;
	margin: 0;
	width: 80%;
`

const containerStyles = (background) => css`
	background-color: ${pickColor(background)};
	padding: 40px 0 ${background ? `150px` : `40px`} 0;
`

const titleStyles = css`
	color: ${colors.red};
	font-size: 24px;
	text-transform: uppercase;
	text-align: center;
	font-weight: bolder;
	border-bottom: 2px solid #ccc;
	padding-bottom: 20px;
`

const htmlStyles = css`
	z-index: 100;
	position: relative;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding: 10%;
	&, * {
		cursor: pointer;
	}
	h2 {
		text-transform: uppercase;
		font-size: 24px;
		font-weight: bolder;
		margin: 0;
		:after {
			content: " ";
			height: 2px;
			width: 80px;
			background-color: #fff;
			display: block;
			margin: 20px auto;
		}
	}
	button {
		border: 2px solid white;
		color: white;
		background: transparent;
		font-size: 20px;
		padding: 5px 35px;
		text-transform: uppercase;
	}
`

const style = css`
	width: 100%;
	height: 100%;
	display: flex;
	flex-flow: row wrap;
	margin: 0 auto;
	list-style: none;
	padding: 0 20px;
	justify-content: space-between;
	a {
		text-decoration: none;
	}
	li {
		flex-basis: 100%;
		overflow: hidden;
		margin: 20px 0;
		color: #fff;
		cursor: pointer;
		.featuredBgImage {
			height: 100%;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-flow: column nowrap;
			transition: all .3s ease;
			min-height: 250px;
			:hover {
				transform: scale(1.03) rotate(.03deg);
				.overlay {
					opacity: .35
				}
				button {
					background: rgba(0, 0, 0, .9)
				}
			}
		}
	}
	@media(${breakpoints.tablet}) {
		li {
			flex-basis: calc(50% - 20px);
		}
	}
	@media(${breakpoints.laptop}) {
		li {
			flex-basis: calc((100% / 3) - 20px);
		}
	}
`

const overlayStyles = (color) => css`
	background-color: ${color.hex};
	opacity: 0;
	transition: opacity .3s ease-out;
	display: block;
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
`
