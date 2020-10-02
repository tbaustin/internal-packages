import React from 'react'
import Img from 'gatsby-image'
import { useStaticQuery, Link, graphql } from 'gatsby'
import { formatPrice, getFluidGatsbyImage } from '@escaladesports/utils'
import { css } from '@emotion/core'

import { useTemplateEngine } from '../../context/template-engine'
import pricingOptions from './pricing-options'

import { priceText } from '../../styles'

const imageKeyQuery = graphql`{
  imageCustomField: sanityCustomField(useAsListImage: { eq: true }) {
    name
  }
}`

export default function ProductTile({ product, priceDisplay }){
	const { variants, sku  } = product
	const defaultVariant = variants?.[0]

	const price = pricingOptions(variants)?.[priceDisplay]

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
		<Wrapper css={productTileStyles} className={`productItem`} {...toProp} itemScope itemType="https://schema.org/Product">
      {sku && <meta itemProp="sku" content={sku} />}
			{
				image
					? <Img fluid={image} itemProp="image" />
					: <img src="https://via.placeholder.com/400" alt="placeholder" itemProp="image" />
			}
      {Array.isArray(price) ? (
        <div className="price" itemProp="offers" itemScope itemType="https://schema.org/AggregateOffer">
          {parsedPath && <meta itemProp="url" content={parsedPath} />}
          <meta itemProp="lowPrice" content={price[0]} />
          <meta itemProp="highPrice" content={price[1]} />
          <meta itemProp="priceCurrency" content={'USD'} />
          {formatPrice(price[0])} - {formatPrice(price[1])}
        </div>
      ) : (
        <div className="price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          {parsedPath && <meta itemProp="url" content={parsedPath} />}
          <meta itemProp="price" content={price} />
          <meta itemProp="priceCurrency" content={'USD'} />
          {formatPrice(price)}
        </div>
      )}
			<strong itemProp="name">{patchedData.name}</strong>
		</Wrapper>
	)
}

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
