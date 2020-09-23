import React from 'react'
import Img from 'gatsby-image'
import { useStaticQuery, Link, graphql } from 'gatsby'
import { formatPrice, getFluidGatsbyImage } from '@escaladesports/utils'
import { css } from '@emotion/core'

import ReviewSnippet from '../../widgets/ReviewSnippetWidget'

import { useTemplateEngine } from '../../context/template-engine'
import pricingOptions from './pricing-options'

import { priceText } from '../../styles'

import { colors } from '../../styles/variables'

const imageKeyQuery = graphql`{
  imageCustomField: sanityCustomField(useAsListImage: { eq: true }) {
    name
  }
}`

export default function ProductTile({ product, priceDisplay }){
	const { variants, sku, customFieldEntries, salsify  } = product
	const { Brand } = salsify

	const defaultVariant = variants?.[0]

	const inStock = variants?.some?.(v => !!v.stock)

	const priceConfig = pricingOptions(variants)
	const price = priceConfig?.[priceDisplay]

	const salePriceRange = priceConfig?.salePriceRange
	const salePrice = customFieldEntries?.find?.(f =>  f.fieldName === `Sale Price`)?.fieldValue?.number

	const { imageCustomField } = useStaticQuery(imageKeyQuery)

	const imageField = defaultVariant.customFieldEntries.find(entry => {
		return entry.fieldName === imageCustomField.name
	})

	const imageUrl = imageField?.fieldValue?.images?.[0]?.externalUrl

	const image = getFluidGatsbyImage(
		imageUrl,
		{ maxWidth: 400 },
	)

	const templateEngine = useTemplateEngine()
	const { patchedData } = templateEngine.patchCustomData(product)

	// const valueOnProduct = templateEngine.resolveProperty(
	// 	`Custom Fields:Color`,
	// 	patchedData,
	// )

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

			{!!variants && <div className="hasVariants smallText">More Options Available</div>}

			<strong>{patchedData.name}</strong>

			{!!Brand && <div className="brand smallText">by {Brand}</div>}

			<div className="pricing">
				{Array.isArray(price)
					? (
						<>
							<div className="price range" css={css`
								margin-bottom: ${salePriceRange ? `10px` : `0px`};
							`}>
								{formatPrice(price[0])} - {formatPrice(price[1])}
							</div>
							{salePriceRange && (
								<div className="salePrice range">
									{formatPrice(salePriceRange[0])} - {formatPrice(salePriceRange[1])}
								</div>
							)}
						</>
					)
					: (
						<>
							<div className="price">{formatPrice(price)}</div>
							{salePrice && (<div className="salePrice">{formatPrice(salePrice)}</div>)}
						</>
					)
				}
			</div>

			<div className="stock smallText">{inStock ? `In Stock` : `Out of Stock`}</div>

			<div className="snippet smallText">
				<ReviewSnippet sku={sku} />
			</div>
		</Wrapper>
	)
}

const productTileStyles = css`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
	text-align: center;
  color: black !important;
  text-decoration: none;
	transition: all 0.2s ease-in-out 0s;
	:hover {
		transform: scale(1.015);
		box-shadow: rgb(51, 51, 51) 0px 10px 15px -10px;
	}
	.snippet {
		.reviewSnippetWidget {
			display: flex;
			justify-content: center;
			align-items: center;
			.star {
				width: 20px;
				height: 20px;
			}
		}
	}
	.smallText {
		color: ${colors.textMedium};
		font-size: .75em;
	}
  > * {
    margin-bottom: 10px;
		width: 100%;
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
    font-size: 1.1rem;
		align-self: flex-start;
  }
	.pricing {
		align-self: flex-start;
		display: flex;
		flex-flow: wrap row;
		align-items: center;
		justify-content: center;
	}
	.price {
		${priceText}
		&:not(.range) {
			margin-right: 10px;
		}
	}
	.range {
		flex-basis: 100%;
	}
	.salePrice {
		color: ${colors.textDark};
		font-size: 1em;
		text-decoration: line-through;
	}
`
