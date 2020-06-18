import React, {
	useState,
	createContext,
	useContext,
	useEffect,
	useMemo,
} from 'react'
import productRequest from './request'
import DefaultRenderer from './default-renderer'



const Context = createContext([])



/**
 * Provider to be used at top level of site/app in order to use product loading
 * functionality
 */
export function ProductsProvider({ children }) {
	const [products, setProducts] = useState(null)

	return (
		<Context.Provider value={[products, setProducts]}>
			{children}
		</Context.Provider>
	)
}



/**
 * Custom hook to load product data based on specified options
 */
export function useProducts(options) {
	// Don't do anything in a non-browser context
	if (typeof window === `undefined`) return []

	const [products, setProducts] = useContext(Context)

	/**
	 * If the set function from context is undefined, that means this hook isn't
	 * being used within a ProductsProvider; show warning in console
	 */
	if (!setProducts) {
		console.warn(`No parent <ProductsProvider> is present`)
		return []
	}

	const memoizedOptions = useMemo(() => {
		return { ...options }
	}, [options])

	useEffect(() => {
		const loadProducts = async () => {
			const data = await productRequest(memoizedOptions)
			setProducts(data)
		}

		// Don't try to fetch in a non-browser context
		typeof window !== `undefined` && loadProducts()
	}, [memoizedOptions])

	return [products, setProducts]
}



/**
 * Component to expose product data & setter function as render props
 * Takes custom render prop or renders simple list by default for simple tests
 */
export function Products(props) {
	const { children, options, ...restProps } = props
	const { displayFields, ...restOptions } = options

	const [products, setProducts] = useProducts(restOptions)
	
	// Don't render anything if set function is undefined (no ProductsProvider)
	if (!setProducts) return null

	const loading = !products

	return (
		<section {...restProps}>
			{typeof children === `function`
				? children({ loading, products, setProducts })
				: <DefaultRenderer
					loading={loading}
					products={products}
					displayFields={displayFields}
				/>
			}
		</section>
	)
}
