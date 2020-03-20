import React from 'react'
import { ProductsProvider } from '@escaladesports/react-esca-api'


export function wrapRootElement({ element }) {
	return (
		<ProductsProvider>
			{element}
		</ProductsProvider>
	)
}
