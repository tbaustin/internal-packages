import React, { useState } from 'react'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { css } from '@emotion/core'
import { useTemplateEngine } from '../../context/template-engine'
import useLivePriceAndStock from '../../context/live-price-and-stock'
import { useProductList } from '../../context/product-lists'
import { variables } from '../../styles'
import CarouselList from '../../components/product-list/carousel-list'
import GridList from '../../components/product-list/grid-list'
import FilterWidget from '../FilterWidget'
import generateFilters from './generate-filters'
import filterProducts from './filter-products'

const { colors, breakpoints, screenWidths } = variables


export default function ProductListWidget(props) {
	const {
		_key,
		title,
		display,
		filters: initFilters = {},
		priceDisplay
	} = props

	const [activeFilters, setActiveFilters] = useState({})

	const enableFilter = initFilters?.enableFilter

	// Try to replace template variable w/ value in case one is provided
	const templateEngine = useTemplateEngine()
	const parsedTitle = templateEngine.parse(title)

	const products = useLivePriceAndStock(useProductList(_key))

	const ListComponent = display === `grid` ? GridList : CarouselList

	const listComponentProps = {
		title: parsedTitle,
		activeFilters: activeFilters,
		priceDisplay: priceDisplay
	}

	if (!enableFilter || display !== `grid`) return (
		<ListComponent
			products={products}
			{...listComponentProps}
		/>
	)

	const customFields = templateEngine?.schema
		?.find(type => type.name === `variant`)?.fields
		?.find(field => field?.name === `customFields`)
		?.fields || []

	const filters = customFields.filter(field => field?.filterWidget)
	const filterValues = generateFilters(filters, products, templateEngine, initFilters)
	const filteredProducts = filterProducts(activeFilters, products, templateEngine)

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
				<ListComponent
					products={filteredProducts}
					{...listComponentProps}
				/>
			</div>
		</section>
	)
}

const styles = css`
	width: 100%;
	display: flex;
  flex-flow: row wrap;
	justify-content: center;
	
	.filters {
		width: 100%;
		max-width: ${screenWidths.tablet};
		padding: 1rem;

		@media(${breakpoints.laptop}) {
			width: 16rem;
		}
	}
	.productList {
		width: 100%;

		@media(${breakpoints.laptop}) {
			flex: 1;
			width: unset;
		}
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
