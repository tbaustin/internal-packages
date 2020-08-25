import React, { useState } from 'react'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { css } from '@emotion/core'

import { useTemplateEngine } from '../context/template-engine'
import useLivePriceAndStock from '../context/live-price-and-stock'
import { useProductList } from '../context/product-lists'
import { variables } from '../styles'

import CarouselList from '../components/product-list/carousel-list'
import GridList from '../components/product-list/grid-list'
import FilterWidget from './FilterWidget'

import generateFilters from '../utils/product/generate-filters'
import filterProducts from '../utils/product/filter-products'

const { colors } = variables

export default function ProductListWidget(props) {
	const { _key, title, display, filters: initFilters = {}, priceDisplay } = props
	const [activeFilters, setActiveFilters] = useState({})

	const enableFilter = initFilters?.enableFilter
	
	// Try to replace template variable w/ value in case one is provided
	const templateEngine = useTemplateEngine()
	const parsedTitle = templateEngine.parse(title)

	const products = useLivePriceAndStock(useProductList(_key))

	function renderList(productList) {
		switch(display){
			case `carousel`: 
				return (
					<CarouselList
						products={productList}
						title={parsedTitle}
						priceDisplay={priceDisplay}
					/>
				)
			default: 
				return (
					<GridList 
						products={productList}
						activeFilters={activeFilters}
						priceDisplay={priceDisplay}
					/>
				)
		}
	}

	if(!enableFilter || display !== `grid`) {
		return renderList(products)
	} else {
		const customFields = templateEngine?.schema
			?.find(type => type.name === `variant`)?.fields
			?.find(field => field?.name === `customFields`)
			?.fields || []
	
		const filters = customFields.filter(field => field?.filterWidget)
		const filterValues = generateFilters(filters, products, templateEngine, initFilters)
		const filteredProducts = filterProducts(activeFilters, products, templateEngine)

		console.log(`All products length: `, products.length)
		console.log(`Filtered Products length: `, filteredProducts)

		return (
			<section css={styles}>
				{!!filterValues.length && (
					<div className="filters">
						{filterValues.map((filter, i) => {
							return (
								<FilterWidget 
									key={i}
									filter={filter}
									activeFilters={activeFilters}
									setActiveFilters={setActiveFilters}
								/>
							)
						})}
					</div>
				)}
				<div className="productList">
					{renderList(filteredProducts)}
				</div>
			</section>
		)
	}
}

const styles = css`
	display: flex;
  flex-flow: row wrap;
	width: 100%;
	.filters {
		flex-basis: 200px;
	}
	.productList {
		flex: 1;
	}
	.activeFilters {
		margin-bottom: 20px;
    border-bottom: 1px solid ${colors.lightGrey};
    padding-bottom: 10px;
	}
	.activeList {
		margin-bottom: 20px;
	}
	.activeFiltersTitle, .title {
		font-size: 24px;
    margin-bottom: 10px;
	}
	.filter {
		margin-bottom: 20px;
		padding-bottom: 10px;
		border-bottom: 1px solid ${colors.lightGrey};
	}
`
