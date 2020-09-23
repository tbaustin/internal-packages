import React from 'react'
import Slick from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { css } from '@emotion/core'
import BannerWidget from './BannerWidget'


export default function SliderWidget(props) {
	const { items, _key: cmsWidgetKey } = props

	const slickSettings = {
		dots: false,
		infinite: true
	}

	return (
		<div css={containerStyles}>
			<Slick {...slickSettings} css={sliderStyles}>
				{items?.map?.((item, i) => {
					const key = `${cmsWidgetKey}-${i}`
					return <BannerWidget key={key} {...item} />
				})}
			</Slick>
		</div>
	)
}


const containerStyles = css`
	width: 100%;

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


const sliderStyles = css`
	> div {
		img {
			margin: 0 auto;
		}
	}
`
