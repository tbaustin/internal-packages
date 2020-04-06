import React from 'react'


/**
 * List of fields under each product list item
 */
const ProductFieldsDisplay = props => {
	const { fields = [], product } = props
	const { sku, name } = product

	const filteredKeys = Object.keys(product).filter(key => {
		return !fields.length || fields.includes(key)
	})

	return (
		<>
			<h2>{name || sku}</h2>
			<ul>
				{filteredKeys.map((key, i) => {
					const val = product[key]

					return (
						<li key={`${sku || name}-${key}-${i}`}>
							<strong>{key}:&nbsp;</strong>
							{typeof val === `object` ? JSON.stringify(val) : val}
						</li>
					)
				})}
			</ul>
		</>
	)
}


/**
 * The actual list of products to show
 */
const ProductListDisplay = props => {
	const { products, fields } = props

	return (
		<ul>
			{products.map(product => {
				const { sku, name } = product

				return (
					<li key={sku || name}>
						<ProductFieldsDisplay
							fields={fields}
							product={product}
						/>
					</li>
				)
			})}
		</ul>
	)
}


/**
 * Default content rendered by the <Products> component this package exports
 */
export default function DefaultProductsRenderer(props) {
	const { loading, products, displayFields = [] } = props

	if (loading) return <div>Loading...</div>

	return (
		<ProductListDisplay
			products={products}
			fields={displayFields}
		/>
	)
}
