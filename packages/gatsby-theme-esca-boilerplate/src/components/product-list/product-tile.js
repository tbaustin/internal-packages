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


const imageFieldQuery = graphql`{
  imageFieldMeta: sanityCustomField(useAsListImage: { eq: true }) {
    name
  }
}`


export default function ProductTile({
	product,
	priceDisplay,
	brand,
	strikeThroughPrice,
}) {
	const { variants, sku  } = product

	const defaultVariant = variants?.[0]

	const inStock = variants?.some?.(v => !!v.stock)

	/**
   * For images, use custom field specified on the variant or fall back to the
   * custom field having useAsListImage true
   */
  const queryData = useStaticQuery(imageFieldQuery)
  const imageFieldMeta = (
    defaultVariant?.listImageCustomField || queryData.imageFieldMeta
  )

	const imageFieldEntry = defaultVariant?.customFieldEntries?.find?.(entry => {
		return entry?.fieldName === imageFieldMeta?.name
	})

	const imageUrl = imageFieldEntry?.fieldValue?.images?.[0]?.externalUrl

	const image = imageUrl && getFluidGatsbyImage(
		imageUrl,
		{ maxWidth: 400 },
	)

	const templateEngine = useTemplateEngine()
	const { patchedData } = templateEngine?.patchCustomData(product) || {}

	const resolveVal = val => templateEngine.data
		? templateEngine.parse(val, patchedData)
		: val

	const priceConfig = pricingOptions(patchedData?.variants, templateEngine, strikeThroughPrice)

	const brandText = resolveVal(brand)
	const strikePrice = resolveVal(strikeThroughPrice)

	const price = priceConfig?.[`defaultVariant`]

	const strikePriceRange = priceConfig?.strikePriceRange

	// const valueOnProduct = templateEngine.resolveProperty(
	// 	`Custom Fields:Color`,
	// 	patchedData,
	// )

	const parsedPath = templateEngine?.parse(
    product?.template?.path || `/`,
    patchedData,
	)
	const Wrapper = parsedPath ? Link : `div`
  const toProp = parsedPath ? { to: parsedPath } : {}

	return (
		<Wrapper css={productTileStyles} className={`productItem`} {...toProp} itemScope itemType="https://schema.org/Product">
      {sku && <meta itemProp="sku" content={sku} />}
			{
				image
					? <Img fluid={image} itemProp="image" />
					: <img src="https://via.placeholder.com/400" alt="placeholder" itemProp="image" />
			}

			{!!variants && variants.length > 1 && <div className="hasVariants smallText">More Options Available</div>}


			<strong itemProp="name">{patchedData?.name}</strong>

			{!!brandText && <div className="brand smallText">by {brandText}</div>}

			<div className="pricing">
				{price && Array.isArray(price)
					? (
						<>
							<div className="price range" css={css`
								margin-bottom: ${strikePriceRange ? `10px` : `0px`};
							`} itemProp="offers" itemScope itemType="https://schema.org/AggregateOffer">
                {parsedPath && <meta itemProp="url" content={parsedPath} />}
                <meta itemProp="lowPrice" content={price[0]} />
                <meta itemProp="highPrice" content={price[1]} />
                <meta itemProp="priceCurrency" content={'USD'} />
								{formatPrice(price[0])} - {formatPrice(price[1])}
							</div>
							{strikePriceRange && (
								<div className="strikePrice range">
									{formatPrice(strikePriceRange[0])} - {formatPrice(strikePriceRange[1])}
								</div>
							)}
						</>
					)
					: (
						<>
							<div className="price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                {parsedPath && <meta itemProp="url" content={parsedPath} />}
                <meta itemProp="price" content={price} />
                <meta itemProp="priceCurrency" content={'USD'} />
                {formatPrice(price)}
              </div>
							{strikePrice && (<div className="strikePrice">{formatPrice(strikePrice)}</div>)}
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
	.strikePrice {
		color: ${colors.textDark};
		font-size: 1em;
		text-decoration: line-through;
	}
`
