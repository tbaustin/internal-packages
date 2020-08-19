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
	const { _key, title, display, filters: initFilters } = props
	const [activeFilters, setActiveFilters] = useState({})
	
	// Try to replace template variable w/ value in case one is provided
	const templateEngine = useTemplateEngine()
	const parsedTitle = templateEngine.parse(title)

	const customFields = templateEngine?.schema
		?.find(type => type.name === `variant`)?.fields
		?.find(field => field?.name === `customFields`)
		?.fields || []
	
	const filters = customFields.filter(field => field?.filterWidget)
	const products = useLivePriceAndStock(useProductList(_key))

	const filterValues = generateFilters(filters, products, templateEngine, initFilters)
	const filteredProducts = filterProducts(activeFilters, products, templateEngine)

	function renderList() {
		switch(display){
			case `carousel`: 
				return (
					<CarouselList
						products={products}
						title={parsedTitle}
					/>
				)
			default: 
				return (
					<GridList 
						products={filteredProducts}
						activeFilters={activeFilters}
					/>
				)
		}
	}

	if(display !== `grid`) {
		renderList()
	} else {
		return (
			<section css={styles}>
				{!!filterValues.length && (
					<div className="filters">
						{/* {!!Object.keys(activeFilters).length && (
							<div className="activeFilters">
								<div className="activeFiltersTitle">Active Filters</div>
								{Object.keys(activeFilters).map((key, i) => {
									if(!activeFilters[key].length) return null

									return (
										<div key={i}>
											<div className="title">
												{key}
											</div>
											<div className="activeList">
												{activeFilters[key].map((filter, i) => {
													return (
														<div key={i}>{filter}</div>
													)
												})}
											</div>
										</div>
									)
								})}
							</div>
						)} */}
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
					{renderList()}
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
