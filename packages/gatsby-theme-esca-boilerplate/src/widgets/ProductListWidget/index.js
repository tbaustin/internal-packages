import React, { useState } from 'react'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { css } from '@emotion/core'
import { useTemplateEngine } from '../../context/template-engine'
import useLivePriceAndStock from '../../context/live-price-and-stock'
import { useProductList } from '../../context/product-lists'
import { breakpoints } from '../../styles/variables'
import CarouselList from '../../components/product-list/carousel-list'
import GridList from '../../components/product-list/grid-list'
import FiltersSection from './filters-section'
import filterProducts from './filter-products'



export default function ProductListWidget(props) {
	const {
		_key,
		title,
		display,
		filters: initFilters = {},
		priceDisplay
	} = props

	const [activeFilters, setActiveFilters] = useState({})

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

	if (!initFilters?.enableFilter || display !== `grid`) return (
		<ListComponent
			products={products}
			{...listComponentProps}
		/>
	)

	const filteredProducts = filterProducts(
		activeFilters,
		products,
		templateEngine
	)

	const filtersSectionProps = {
		products,
		initFilters,
		activeFilters,
		setActiveFilters
	}

	return (
		<section css={styles}>
			<FiltersSection {...filtersSectionProps} />
			<FiltersSection mobile {...filtersSectionProps} />
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

	.productList {
		width: 100%;

		@media(${breakpoints.laptop}) {
			flex: 1;
			width: unset;
		}
	}
`
