import React, { useReducer, createContext, useContext, useEffect } from 'react'

import productRequest from '../utils/product-request'

const Context = createContext()

const pollInterval = 1 * 60 * 1000
const options = {
	site: `bear`,
	env: `prod`,
	fields: ["inventory", "price"],
	salsify: ["Web Images"],
	url: `https://products.escsportsapi.com/load`
}

const contextProductRequest = async (options, setProducts) => {
	const products = await productRequest(options)
	setProducts(products)

	setTimeout(() => contextProductRequest(options, setProducts), pollInterval);
}

export function EscaProductsComp({ children }) {
	const [products, setProducts] = useContext(Context)
	useEffect(() => {
		if(typeof window !== `undefined`){
			contextProductRequest(options, setProducts)
		}
	}, [])

	return (
		<section>
			{children({
				loading: !Object.keys(products).length,
				products: Object.keys(products).map(productId => ({...products[productId], sku: productId}))
			})}
		</section>
	)
}

export function WithEscaProducts({ children }) {
	const [products, setProducts] = useReducer((_, action) => action, {})
	return (
		<Context.Provider value={[products, setProducts]}>
			{children}
		</Context.Provider>
	)
}

export function useEscaProducts(skus, endpoint) {
	const [products, setProducts] = useContext(Context)

	useEffect(() => {
		if(typeof window !== `undefined`){
			contextProductRequest(options, setProducts)
		}
	}, [])

	return [products, setProducts]
}