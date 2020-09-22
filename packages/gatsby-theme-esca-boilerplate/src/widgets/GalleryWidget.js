import React, { useEffect, useState, useMemo } from 'react'
import { css } from '@emotion/core'
import Slick from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'gatsby-image'
import { getFluidGatsbyImage } from '@escaladesports/utils'
import { sanityProjectId, sanityDataset } from 'config'
import { useTemplateEngine } from '../context/template-engine'
import { colors } from '../styles/variables'


const sanityConfig = {
	projectId: sanityProjectId,
	dataset: sanityDataset,
}


export default function GalleryWidget(props) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const { imageSet, _key: cmsWidgetKey } = props

	const { templateVariable, manualImages } = imageSet || {}
	const templateEngine = useTemplateEngine()
	const templateValue = templateEngine.resolveProperty(templateVariable)
	const images = templateValue || manualImages || []


	const mainImage = useMemo(() => {
		const image = images?.[currentIndex]
		if (!image) return null

		const imageId = image?.asset?._id
			|| image?.asset?._ref
			|| image?.externalUrl

		return getFluidGatsbyImage(imageId, { maxWidth: 800 }, sanityConfig)
	}, [currentIndex])


  const slickSettings = {
		dots: false,
		infinite: false,
		slidesToShow: 4,
		slidesToScroll: 1
	}

	return (
		<div css={containerStyles}>
			{mainImage && <Image className="main-image" fluid={mainImage} />}
			<Slick {...slickSettings}>
				{images?.map?.((image, i) => {
          const key = `${cmsWidgetKey}-${i}`

					const { asset, externalUrl } = image
					const imageId = asset?._id || asset?._ref || externalUrl

					const fluid = getFluidGatsbyImage(
						imageId,
						{ maxWidth: 400 },
						sanityConfig,
					)

          const activeClass = i === currentIndex ? `active` : ``
          const className = `thumbnail ${activeClass}`

          const handleClick = () => setCurrentIndex(i)

					return (
						<div key={key} className={className} onClick={handleClick}>
							{fluid && <Image fluid={fluid} />}
						</div>
					)
				})}
			</Slick>
		</div>
	)
}



const containerStyles = css`
	flex: 1;
	overflow: hidden;
	width: 100%;

	.main-image {
		max-height: 50vh;

		img {
			object-fit: contain !important;
		}
	}

	.thumbnail {
		cursor: pointer;
		border: 2px solid transparent;

		:not(.active) {
			opacity: 0.5;
		}
	}

	.active {
		border-color: ${colors.red};
	}
`
