import React, { useRef } from 'react'
import { css } from '@emotion/core'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { variables } from '../../styles'
import ProductTile from './product-tile'


const { colors, screenWidths } = variables


export default function ProductCarouselList(props) {
	const { products, title, priceDisplay } = props
	const slider = useRef(null)

	const settings = {
		dots: false,
		infinite: products.length > 4,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: false,
		responsive: [
			{
				breakpoint: 850,
				settings: {
					slidesToShow: 3,
					infinite: products.length > 3,
				},
			},
			{
				breakpoint: 650,
				settings: {
					slidesToShow: 2,
					infinite: products.length > 2,
				},
			},
			{
				breakpoint: 424,
				settings: {
					slidesToShow: 1,
					infinite: products.length > 1,
				},
			},
		],
	}

	function previous(){
    slider?.current?.slickPrev?.()
	}

	function next(){
    slider?.current?.slickNext?.()
  }

  function showArrows(){
    return slider?.current?.props?.children.length > slider?.current?.props?.slidesToShow
  }

	return (
		<section css={carouselContainer}>
			<div className="wrapper">
				<div className="titleWrapper">
					<h2>{title}</h2>
          {showArrows() && (
            <div className="arrowWrapper">
              <div onClick={previous} className="arrow left"></div>
              <div onClick={next} className="arrow right"></div>
            </div>
          )}

				</div>

				<Slider {...settings} css={slickStyles} ref={slider}>
					{products && products.map((product, idx) => {
						const { sku } = product
						const key = `${sku}-${idx}`
						return <ProductTile priceDisplay={priceDisplay} key={key} product={product} />
					})}
				</Slider>
			</div>
		</section>
	)
}


const slickStyles = css`
  margin: 0 auto 30px auto;
  width: 100%;
`

const carouselContainer = css`
  width: 100vw;
  padding: 0 20px;
  .wrapper {
    max-width: ${screenWidths.desktop};
    margin: 0 auto;
  }
  .titleWrapper {
    border-bottom: 2px solid #ccc;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 40px;
  }
  h2 {
    color: ${colors.red};
    text-transform: uppercase;
    font-size: 24px;
    font-weight: bolder;
    margin: 20px auto;
  }
  .arrowWrapper {
    display: inline-flex;
  }
  .arrow {
    width: 20px;
    height: 20px;
    border-bottom: 4px solid #333;
    border-right: 4px solid #333;
    border-radius: 2px;
    margin: 0 10px;
    cursor: pointer;
  }
  .left {
    transform: rotate(135deg);
  }
  .right {
    transform: rotate(-45deg);
  }
`
