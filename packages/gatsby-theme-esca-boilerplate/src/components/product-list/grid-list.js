import React from 'react'
import { css } from '@emotion/core'

import Container from '../container'
import ProductTile from './product-tile'

export default function ProductGridList(props){
	const { products, priceDisplay, ...rest } = props

	return (
		<Container direction="row" width="constrained" align="flex-start" smartPadding="0 auto">
			<div css={productListStyles}>
				{!products.length
					? <h3>No Products found</h3>
					: products.map((product, idx) => {
						const { sku } = product
						const key = `${sku}-${idx}`
						return <ProductTile 
							{...rest}
							priceDisplay={priceDisplay} 
							key={key} 
							product={product}
						/>
					})}
			</div>
		</Container>
	)
}

const productListStyles = css`
	display: flex;
	flex-flow: row wrap;
	width: 100%;
	margin: -10px;
	justify-content: center;
	.productItem {
		flex-basis: 100%;
		margin: 10px;
		max-width: 350px;
		min-width: 200px;
	}
	@media(min-width: 487px){
		.productItem {
			flex-basis: calc(50% - 20px);
		}
	}
	@media(min-width: 768px){
		.productItem {
			flex-basis: calc((100% / 3) - 20px);
		}
	}
`