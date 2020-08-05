import React, { useEffect, useState, useMemo } from 'react'
import Img from 'gatsby-image'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { css } from '@emotion/core'
import BackgroundImage from 'gatsby-background-image'
import sanitize from 'sanitize-html'
import { Link } from 'gatsby'
import { getFluidGatsbyImage } from '@escaladesports/utils'
import { sanityProjectId, sanityDataset } from 'config'
import { useTemplateEngine } from '../context/template-engine'
import { colors } from '../styles/variables'


const sanityConfig = {
	projectId: sanityProjectId,
	dataset: sanityDataset,
}


export default function CarouselWidget(props) {
	const { items: itemsProp, useBannerStyle, templateVariable = `` } = props
	const templateEngine = useTemplateEngine()
	const templateValue = templateEngine.resolveProperty(templateVariable)

	const items = templateValue
		? templateValue?.map?.(image => ({ image }))
		: itemsProp || []

	const [curIdx, setIdx] = useState(0)


	const mainImage = useMemo(() => {
		const image = items?.[curIdx]?.image
		if (!image) return null

		const imageId = image?.asset?._id
			|| image?.asset?._ref
			|| image?.externalUrl

		return getFluidGatsbyImage(
			imageId,
			{ maxWidth: 800 },
			sanityConfig,
		)
	}, [items, curIdx])


	if (useBannerStyle) {
		const settings = {
			dots: false,
			infinite: true,
		}

		return (
			<div css={itemsStyles}>
				<Slider {...settings} css={slickStyles}>
					{items?.map?.((item, i) => {
						const { image, link, html } = item || {}

						const imageId = image?.asset?._id
							|| image?.asset?._ref
							|| image?.externalUrl

						const fluid = getFluidGatsbyImage(
							imageId,
							{ maxWidth: 2000 },
							sanityConfig,
						)

						return (
							<div key={i} css={slideStyles}>
								<BackgroundImage
									fluid={fluid && fluid}
									className={`carouselBgImage`}
								>
									{html && <Link to={link}>
										<div
											css={htmlStyles}
											dangerouslySetInnerHTML={{ __html: sanitize(html, {
												allowedTags: sanitize.defaults.allowedTags.concat([
													`h1`,
													`button`,
												]),
											})}} />
									</Link>
									}
								</BackgroundImage>
							</div>
						)
					})}
				</Slider>
			</div>
		)
	}

	const settings = {
		dots: false,
		infinite: false,
		slidesToShow: 4,
		slidesToScroll: 1,
	}

	return (
		<div css={imagesStyles}>
			{mainImage && <Img className="mainImage" fluid={mainImage} />}
			<Slider {...settings}>
				{items?.map?.((item, i) => {
					const { asset, externalUrl } = item?.image || {}

					const imageId = asset?._id || asset?._ref || externalUrl

					const fluid = getFluidGatsbyImage(
						imageId,
						{ maxWidth: 400 },
						sanityConfig,
					)

					return (
						<div
							key={i}
							css={slideStyles}
							onClick={() => setIdx(i)}
							className={`sliderImg`}
						>
							<div className={`inner${i === curIdx ? ` activeImg` : ``}`}>
								{fluid && <Img fluid={fluid} />}
							</div>
						</div>
					)
				})}
			</Slider>
		</div>
	)
}

const itemsStyles = css`
	margin: 0 auto 30px auto;
	width: 100vw;
	max-width: 2000px;
	.slick-arrow {
		z-index: 5;
		width: 50px;
		height: 50px;
		:hover {
			opacity: .5;
		}
		::before {
			color: #ccc;
			font-size: 50px;
			opacity: 1;

		}
	}
	.slick-prev {
		left: 30px;
	}
	.slick-next {
		right: 30px;
	}

	`

const thumbnailsStyle = css`
	flex: 1;
`

const slickStyles = css`
	> div {
		img {
			margin: 0 auto;
		}
	}
`

const slideStyles = css`
	.carouselBgImage {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-flow: column nowrap;
		height: 60vh;
	}
`

const htmlStyles = css`
	z-index: 100;
	position: relative;
	button {
		background-color: ${colors.red};
		border: none;
		outline: none;
		color: white;
		text-transform: uppercase;
		font-size: 16px;
		font-weight: bolder;
		padding: 25px 40px;
		cursor: pointer;
	}
`

const imagesStyles = css`
	flex: 1;
	overflow: hidden;

	.mainImage {
		max-height: 50vh;

		img {
			object-fit: contain !important;
		}
	}

	.inner {
		cursor: pointer;
		border: 2px solid transparent;
		:not(.activeImg) {
			opacity: 0.5;
		}
	}

	.activeImg {
		border-color: ${colors.red};
	}
`
