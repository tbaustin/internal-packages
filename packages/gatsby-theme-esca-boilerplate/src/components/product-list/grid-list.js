import React, { useState, useMemo } from 'react'
import get from 'lodash/get'
import { css } from '@emotion/core'

import { useTemplateEngine } from '../../context/template-engine'
import Container from '../container'
import ProductTile from './product-tile'

const sortArr = (arr, dir, val) => {
	return [...arr].sort((a, b) => {
		const aVal = get(a, val)
		const bVal = get(b, val)

		if(dir === `desc`) {
			return (bVal===null)-(aVal===null) || +(bVal>aVal) || -(bVal<aVal)
		} else {
			return (aVal===null)-(bVal===null) || +(aVal>bVal) || -(aVal<bVal)
		}
	})
}

export default function ProductGridList(props){
	const { products, priceDisplay } = props

	const templateEngine = useTemplateEngine()
	
	const patchedProducts = useMemo(() => {
		return products
			.filter(prod => !!prod?.variants[0]?.price)
			.map(prod => {
				const patchedData = templateEngine?.patchCustomData(prod)?.patchedData || prod
				return patchedData
			})
	}, [products])

	// products.forEach(prod => {
	// 	console.log(`Template Engine`, templateEngine)
	// })
	const [sortedProducts, setSort] = useState(null)


	const handleSort = e => {
		let newSort = []
		switch(e.target.value){
			case `relavance`:
				newSort = [...products]
				break
			case `nameAsc`:
				newSort = sortArr(patchedProducts, `asc`, `name`)
				break
			case `nameDesc`:
				newSort = sortArr(patchedProducts, `desc`, `name`)
				break
			case `priceAsc`:
				newSort = sortArr(products, `asc`, `variants[0].price`)
				break
			case `priceDesc`:
				newSort = sortArr(products, `desc`, `variants[0].price`)
				break
			default:
				break
		}

		if(newSort.length) setSort(newSort)
	}

	return (
		<Container direction="row" width="constrained" align="flex-start" smartPadding="0 auto">
			
			<div css={sortCss} className="sort">
				<select onChange={handleSort} className="productListSort">
					<option value="relavance">Relevance</option>
					<option value="nameAsc">Name (A - Z)</option>
					<option value="nameDesc">Name (Z - A)</option>
					<option value="priceAsc">Price (Low to High)</option>
					<option value="priceDesc">Price (High to Low)</option>
				</select>
			</div>
			<div css={productListStyles}>
				{!products.length
					? <h3>No Products found</h3>
					: (sortedProducts || products).map((product, idx) => {
						const { sku } = product
						const key = `${sku}-${idx}`
						return <ProductTile priceDisplay={priceDisplay} key={key} product={product} />
					})}
			</div>
		</Container>
	)
}

const productTileWidth = `350px`

const sortCss = css`
	max-width: calc(${productTileWidth} * 3);
	margin: 20px auto;
	width: 100%;
	justify-content: flex-end;
	display: flex;
	.productListSort {
		padding: 5px;
	}
`

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