import React from 'react'
import { css } from '@emotion/core'
import { useTemplateEngine } from '../../context/template-engine'
import useLivePriceAndStock from '../../context/live-price-and-stock'
import { useProductList } from '../../context/product-lists'
import { breakpoints } from '../../styles/variables'
import FiltersSection from './filters-section'
import FilterAndSortProvider from './filter-and-sort-context'
import ProductList from './product-list'
import Toolbar from './toolbar'



export default function ProductListWidget(props) {
	const {
		_key,
		filters: filterSettings,
		title,
		display,
		priceDisplay
	} = props

	const templateEngine = useTemplateEngine()

	const rawProducts = useLivePriceAndStock(useProductList(_key))

	const patchedProducts =  rawProducts
	  .filter(prod => prod?.variants?.every?.(v => v?.price))
	  .map(prod => {
	    const { patchedData } = templateEngine.patchCustomData(prod) || {}
	    return patchedData || prod
	  })

	if (!filterSettings?.enableFilter || display !== `grid`) return (
		<ProductList
			products={patchedProducts}
			title={title}
			display={display}
			priceDisplay={priceDisplay}
		/>
	)

	return (
		<FilterAndSortProvider products={patchedProducts}>
			<section css={styles}>
				<Toolbar filterSettings={filterSettings} />
	      <FiltersSection filterSettings={filterSettings} />
				<div className="productList">
					<ProductList
						title={title}
						display={display}
						priceDisplay={priceDisplay}
					/>
				</div>
			</section>
		</FilterAndSortProvider>
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
