import * as validation from '../../validation'


export const cartImageFields = {
	title: `Cart Image Fields`,
	name: `cartImageFields`,
	type: `image`,
	fields: [
		{
			title: `Use Template Variable`,
			description: `
        For templates only: if the data source (e.g. category or product) has
        an image field, you can type the name of that field here instead of
        selecting/uploading an image above. Do not include curly braces.
      `,
			name: `templateVariable`,
			type: `string`,
			options: {
				isHighlighted: true,
			},
		},
	],
}


export const AddToCartWidget = {
	title: `"Add to Cart" Button`,
	name: `AddToCartWidget`,
	type: `object`,
	fields: [
		{
			name: `sku`,
			title: `Product SKU`,
			type: `string`,
		},
		{
			name: `name`,
			title: `Product Name`,
			type: `string`,
		},
		{
			name: `image`,
			title: `In-cart Image for Product`,
			type: `cartImageFields`,
		},
		{
			name: `description`,
			title: `In-cart Description for Product`,
			type: `string`,
		},
		{
			name: `price`,
			title: `Price`,
			type: `string`,
			validation: validation.numberOrVariable,
		},
		{
			name: `stock`,
			title: `Stock`,
			type: `string`,
			validation: validation.numberOrVariable,
		},
		{
			name: `allowQuantity`,
			title: `Allow Quantity Selection`,
			type: `boolean`,
		},
	],
}


export const PriceStockWidget = {
	title: `Price and Stock`,
	name: `PriceStockWidget`,
	type: `object`,
	fields: [
		{
			name: `price`,
			title: `Price`,
			type: `string`,
			validation: validation.numberOrVariable,
		},
		{
			name: `stock`,
			title: `Stock`,
			type: `string`,
			validation: validation.numberOrVariable,
		},
	],
}


export const ProductOverviewWidget = {
	title: `Product Overview Section`,
	name: `ProductOverviewWidget`,
	type: `object`,
	fieldsets: [
		{ name: `variant-selection`, title: `Variant Selection` },
	],
	fields: [
		{
			title: `Image Gallery`,
			name: `imageGallery`,
			type: `GalleryWidget`,
		},
		...AddToCartWidget.fields,  // 😎
		{
			title: `Brand Text`,
			name: `brandText`,
			type: `string`,
		},
		{
			title: `Shipping Info Text`,
			name: `shippingInfo`,
			type: `array`,
			of: [{ type: `block` }],
		},
		{
			title: `Selection Method`,
			name: `variantSelectionMethod`,
			type: `string`,
			fieldset: `variant-selection`,
			options: {
				list: [
					{
						title: `None (don't allow selecting variant)`,
						value: ``,
					},
					{
						title: `Filter by attributes`,
						value: `by-attributes`,
					},
					{
						title: `Select by variant SKU/title`,
						value: `by-sku`,
					},
				],
			},
		},
		{
			title: `Trim Common Text from Product Names`,
			description: `Only applies to the "Select by variant SKU/title" method`,
			name: `trimVariantLabels`,
			type: `boolean`,
			fieldset: `variant-selection`,
		},
	],
}


export const ProductDetailsWidget = {
	title: `Product Details`,
	name: `ProductDetailsWidget`,
	type: `object`,
	fields: [
		{
			name: `sku`,
			title: `Product SKU`,
			type: `string`,
		},
		{
			title: `Description`,
			name: `description`,
			type: `text`,
		},
		{
			title: `Bullet Points`,
			name: `bullets`,
			type: `array`,
			of: [{ type: `string` }],
		},
	],
}

export const FilterObject = {
	name: `filterObject`,
	title: `Filter Object`,
	type: `object`,
	options: {
		collapsible: true,
		collapsed: true,
	},
	fields: [
		{ title: `Enable Filters`, name: `enableFilter`, type: `boolean` },
		{ title: `Price`, name: `priceFilter`, type: `boolean` },
		{ title: `Stock`, name: `stockFilter`, type: `boolean` },
		{ title: `Review Rating`, name: `ratingFilter`, type: `boolean` },
	],
}


export const ProductListWidget = {
	title: `Product List`,
	name: `ProductListWidget`,
	type: `object`,
	fields: [
		{
			title: `Filter by Category`,
			description: `Use one of these methods to determine the category`,
			name: `categorySources`,
			type: `variableCategory`,
		},
		{
			title: `Choose Specific Products`,
			name: `productListSources`,
			type: `variableProductList`,
		},
		{
			title: `Filters`,
			name: `filters`,
			type: `filterObject`,
			description: `Will only work when using Display Type of "grid".`,
		},
		{
			title: `Title`,
			name: `title`,
			type: `string`,
			description: `This will override any other title for the list.`,
		},
		{
			title: `Price Display on Product Tile`,
			name: `priceDisplay`,
			type: `string`,
			options: {
				list: [
					{ title: `Default Variant Price`, value: `defaultVariant` },
					{ title: `Price Range`, value: `priceRange` },
					{ title: `Lowest Price`, value: `priceLowest` },
					{ title: `Highest Price` ,value: `priceHighest`},
				],
			},
		},
		{
			title: `Display Type`,
			name: `display`,
			type: `string`,
			options: {
				list: [`grid`,`carousel`],
			},
		},
		{
			title: `Limit`,
			name: `limit`,
			description: `Limit the number of products displayed`,
			type: `number`,
			validation: Rule => Rule.min(1).integer(),
		},
	],
	preview: {
		select: {
			category: `category.name`,
		},
		prepare(selection) {
			const { category } = selection
			return {
				title: `${category} Products`,
			}
		},
	},
}
