import React from 'react'
import CarouselList from '../../components/product-list/carousel-list'
import GridList from '../../components/product-list/grid-list'
import { useTemplateEngine } from '../../context/template-engine'
import { useFilterAndSort } from './filter-and-sort-context'



export default function ProductList(props) {
	const { title, display, priceDisplay, products } = props

	// Try to replace template variable w/ value in case one is provided
	const templateEngine = useTemplateEngine()
	const parsedTitle = templateEngine.parse(title)

	const filterAndSort = useFilterAndSort()
	const filteredAndSortedProducts = filterAndSort?.products

	const ListComponent = display === `grid` ? GridList : CarouselList

	const listComponentProps = {
		products: products || filteredAndSortedProducts,
		title: parsedTitle,
		priceDisplay
	}

	return <ListComponent {...listComponentProps} />
}
