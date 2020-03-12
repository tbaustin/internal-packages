import React, { useReducer, createContext, useContext, useEffect } from 'react'

import productRequest from '../utils/product-request'

const Context = createContext()

const pollInterval = 1 * 60 * 1000


const contextProductRequest = async (options, setProducts) => {
	const products = await productRequest(options)
	setProducts(products)

	setTimeout(() => contextProductRequest(options, setProducts), pollInterval)
}

export function WithProducts({ children }) {
	const [products, setProducts] = useReducer((_, action) => action, [])
	return (
		<Context.Provider value={[products, setProducts]}>
			{children}
		</Context.Provider>
	)
}

export function Products({ children, options, ...restProps }) {
	const [products, setProducts] = useContext(Context)
	const { displayFields, ...restOptions } = options

	useEffect(() => {
		if (typeof window !== `undefined`) {
			contextProductRequest(restOptions, setProducts)
		}
	}, [])

	const loading = !!products.length

	return (
		<section {...restProps}>
			{children
				? children({
					loading,
					products,
				})
				: <ul>
					{!loading
						? products.map(product => (
							<li key={product.sku}>
								<h2>{product.name || product.sku}</h2>
								<ul>
									{displayFields
										? displayFields.map((field, i) => <li key={`${field}-${i}`}>{product[field] || `Field does not exist on product`}</li>)
										: Object.keys(product).map((field, i) => <li key={`${field}-${i}`}>{product[field]}</li>)
									}
								</ul>
							</li>
						))
						: <div>Loading...</div>
					}
				</ul>
			}
		</section>
	)
}

export function useProducts(options) {
	const [products, setProducts] = useContext(Context)

	useEffect(() => {
		if (typeof window !== `undefined`) {
			contextProductRequest(options, setProducts)
		}
	}, [])

	return [products, setProducts]
}