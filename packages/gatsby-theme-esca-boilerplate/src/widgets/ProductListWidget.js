import React, { useRef, useState } from 'react'
import { formatPrice, getFluidGatsbyImage } from '@escaladesports/utils'
import { graphql, useStaticQuery, Link } from 'gatsby'
import Img from 'gatsby-image'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { css } from '@emotion/core'
import { useTemplateEngine } from '../context/template-engine'
import { useProductList } from '../context/product-lists'
import Container from '../components/container'
import { sanityProjectId, sanityDataset } from 'config'
import { variables, priceText } from '../styles'


const { breakpoints, colors, screenWidths } = variables


const imageKeyQuery = graphql`{
  imageCustomField: sanityCustomField(useAsListImage: { eq: true }) {
    name
  }
}`


function ProductTile({ product }){
	const { variants, sku } = product
	const defaultVariant = variants?.[0]

	const { imageCustomField } = useStaticQuery(imageKeyQuery)

	const imageField = defaultVariant.customFieldEntries.find(entry => {
		return entry.fieldName === imageCustomField.name
	})

  const imageUrl = imageField?.fieldValue?.images?.[0]?.externalUrl

	const image = getFluidGatsbyImage(
		imageUrl,
		{ maxWidth: 400 }
	)

	const templateEngine = useTemplateEngine()
	const { patchedData } = templateEngine.patchCustomData(product)

	const parsedPath = templateEngine.parse(
    product?.template?.path || `/`,
    patchedData,
	)
	const Wrapper = parsedPath ? Link : `div`
	const toProp = parsedPath ? { to: parsedPath } : {}

	return (
		<Wrapper css={productTileStyles} className={`productItem`} {...toProp}>
			{
				image
					? <Img fluid={image} />
					: <img src="https://via.placeholder.com/400" alt="placeholder" />
			}
			<div className="price">
				{formatPrice(defaultVariant.price)}
			</div>
			<strong>{patchedData.name}</strong>
		</Wrapper>
	)
}


export default function ProductListWidget(props) {
	const { _key, title, display } = props

	const slider = useRef(null)
	const [loadAmount, setAmount] = useState(3)

	// Try to replace template variable w/ value in case one is provided
	const templateEngine = useTemplateEngine()
	const parsedTitle = templateEngine.parse(title)

	const products = useProductList(_key)

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

	if(display === `carousel`){
		return (
			<section css={carouselContainer}>
				<div className="wrapper">
					<div className="titleWrapper">
						<h2>{parsedTitle}</h2>
						<div onClick={previous} className="arrow left"></div>
						<div onClick={next} className="arrow right"></div>
					</div>

					<Slider {...settings} css={slickStyles} ref={slider}>
						{products && products.map((product, idx) => {
							const { sku } = product
							const key = `${sku}-${idx}`
							return <ProductTile key={key} product={product} />
						})}
					</Slider>
				</div>
			</section>
		)
	} else {
		return (
			<Container direction="row" width="constrained" align="flex-start" smartPadding="0 auto">
				<div css={productListStyles}>
					{!products.length
						? <h3>No Products found</h3>
						: products.map((product, idx) => {
							const { sku } = product
							const key = `${sku}-${idx}`
							return <ProductTile key={key} product={product} />
						})}
				</div>
				{/* <div css={loadMore}>
					{(products.length > loadAmount) && (
						<button onClick={() => setAmount(loadAmount + 3)}>
							Load More
						</button>
					)}
				</div> */}
			</Container>
		)
	}
}

const loadMore = css`
	margin: 50px 0;
	width: 100%;
	display: flex;
	justify-content: center;
	button {
		cursor: pointer;
		text-transform: uppercase;
		font-size: 20px;
		color: ${colors.white};
		background: ${colors.red};
		outline: 0;
		border: 0;
		padding: 20px 50px;
	}
`

const productListStyles = css`
	display: flex;
	flex-flow: row wrap;
	width: 100%;
	margin: -10px;
	.productItem {
		flex-basis: 100%;
		margin: 10px;
	}
	@media(min-width: 425px){
		.productItem {
			flex-basis: calc(50% - 20px);
		}
	}
	@media(min-width: 768px){
		.productItem {
			flex-basis: calc((100% / 3) - 20px);
			:last-of-type {
				margin-right: auto;
			}
		}
	}
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

const slickStyles = css`
  margin: 0 auto 30px auto;
  width: 100%;
`

const productTileStyles = css`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
	text-align: left;
  color: black !important;
  text-decoration: none;

  > * {
    margin-bottom: 20px;
  }
	.gatsby-image-wrapper {
		width: 100%;
	}
  img {
    width: 100%;
    height: 100%;
    overflow: hidden;
    object-fit: contain;
  }
  strong {
    font-size: 1.5rem;
		align-self: flex-start;
  }
	.price {
		${priceText}
		align-self: flex-start;
	}
`


const cardStyle = css`
  width: 100%;
  height: 75vw;
  .gatsby-image-wrapper{
    width: 100%;
  }

  @media (${breakpoints.phoneLarge}) {
    width: 50%;
    height: 50vw;
  }

  @media (${breakpoints.desktop}) {
    width: 33%;
    height: 30vw;
  }

  margin-bottom: 3rem;
  padding: 0 20px;

  display: flex;
  flex-direction: column;
  align-items: center;

  strong {
    font-size: 1.5rem;
  }

  img {
    width: 100%;
    height: 100%;
    overflow: hidden;
    object-fit: contain;
  }
`
