import React, { useState, useMemo } from 'react'
import get from 'lodash/get'
import { css } from '@emotion/core'

import { useTemplateEngine } from '../../context/template-engine'
import Container from '../container'
import ProductTile from './product-tile'
import { breakpoints } from '../../styles/variables'

const sortArr = (arr, dir, val) => {
	return [...arr].sort((a, b) => {
		const aVal = get(a, val)
		const bVal = get(b, val)

		// if both vals are numbers we need to use the 
		// "numeric" option to sort numbers, otherwise just 
		// compare as alphanumeric even if one is a number 

		// if the value does not exist push it to the back
		if(dir === `asc`) {
			return bVal 
				? `${aVal}`.localeCompare(`${bVal}`, undefined, { numeric: +aVal && +bVal ? true : false })
				: -1
		
		} else {
			return aVal 
				? `${bVal}`.localeCompare(`${aVal}`, undefined, { numeric: +aVal && +bVal ? true : false })
				: 1
		}
	})
}

export default function ProductGridList(props){
	const { products, priceDisplay, ...rest } = props

	const templateEngine = useTemplateEngine()
	
	const patchedProducts =  products
		.filter(prod => !!prod?.variants?.every(v => !!v.price))
		.map(prod => {
			const patchedData = templateEngine?.patchCustomData(prod)?.patchedData || prod
			return patchedData
		})

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