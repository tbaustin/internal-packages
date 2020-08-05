import React, { useContext, createContext } from 'react'


const ProductListsContext = React.createContext()


export const useProductList = widgetKey => {
	const lists = useContext(ProductListsContext)
	return lists[widgetKey] || []
}


export default function Provider(props) {
	const { children, lists, products } = props

	const contextValue = {}

	for (let key in lists) {
		let listProducts = lists[key].map(sku => {
			return products.find(p => p.sku === sku)
		})
		contextValue[key] = listProducts
	}

	return (
		<ProductListsContext.Provider value={contextValue}>
			{children}
		</ProductListsContext.Provider>
	)
}
