import React from 'react'
import Img from 'gatsby-image'
import { useStaticQuery, Link, graphql } from 'gatsby'
import { formatPrice, getFluidGatsbyImage } from '@escaladesports/utils'
import { useTemplateEngine } from '../../context/template-engine'
import { css } from '@emotion/core'

import { priceText } from '../../styles'

const imageKeyQuery = graphql`{
  imageCustomField: sanityCustomField(useAsListImage: { eq: true }) {
    name
  }
}`

export default function ProductTile({ product }){
	const { variants, sku } = product
	const defaultVariant = variants?.[0]

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
			<div className="price">
				{formatPrice(defaultVariant.price)}
			</div>
			<strong>{patchedData.name}</strong>
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