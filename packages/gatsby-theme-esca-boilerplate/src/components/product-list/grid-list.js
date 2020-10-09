import React from 'react'
import { css } from '@emotion/core'
import ProductTile from './product-tile'
import { breakpoints } from '../../styles/variables'


export default function ProductGridList(props){
	const { products, priceDisplay, ...rest } = props

	return (
		<div css={productListStyles}>
			{!products.length
				? <h3>No Products found</h3>
				: products.map((product, idx) => {
					const { sku } = product
					const key = `${sku}-${idx}`
					return (
						<ProductTile
							{...rest}
							priceDisplay={priceDisplay}
							key={key}
							product={product}
						/>
					)
				})}
		</div>
	)
}


const productTileWidth = `350px`


const productListStyles = css`
	display: flex;
	flex-flow: row wrap;
	width: 100%;
	margin: -10px;
	justify-content: center;
	.productItem {
		flex-basis: 100%;
		margin: 10px;
		max-width: ${productTileWidth};
		min-width: 200px;
	}
	@media(${breakpoints.phoneLarge}){
		.productItem {
			flex-basis: calc(50% - 20px);
		}
	}
	@media(${breakpoints.tablet}){
		.productItem {
			flex-basis: calc((100% / 3) - 20px);
		}
	}
`
