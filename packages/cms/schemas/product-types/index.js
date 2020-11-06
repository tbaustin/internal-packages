import TreeSelect from '../../custom-inputs/tree-select'
import VariantList from '../../custom-inputs/variant-list'
import productFields from './fields'


let apiProducts = []


export const baseProduct = {
	name: `baseProduct`,
	title: `Base Products`,
	type: `document`,
	fields: [
		...productFields,
		{
			name: `categories`,
			title: `Categories`,
			type: `array`,
			of: [
				{
					type: `reference`,
					to: [{ type: `category` }],
				},
			],
			// inputComponent: TreeSelect
		},
		{
			name: `variants`,
			title: `Variants`,
			description: `Click & drag to change order`,
			type: `array`,
			of: [
				{
					type: `reference`,
					to: [
						{ type: `variant` },
					],
				},
			],
			inputComponent: VariantList,
		},
		{
			name: `relatedProducts`,
			title: `Related Products`,
			type: `array`,
			of: [
				{
					type: `reference`,
					to: [{ type: `baseProduct` }],
				},
			],
		},
		{
			name: `template`,
			title: `Template`,
			type: `reference`,
			to: [{ type: `template` }],
		},
	],
	preview: {
		select: {
			title: `slug.current`,
			subtitle: `sku`
		}
	}
}

export const variant = {
	name: `variant`,
	title: `Product Variant`,
	type: `document`,
	fields: [
		...productFields,
		{
			name: `listImageCustomField`,
			title: `Custom field to use for product list tile image`,
			description: `Defaults to the custom field that has "Use for product `
				+ `list images" turned on`,
			type: `reference`,
			to: [{ type: `customField` }],
			options: {
				filter: `fieldType == "images"`
			}
		}
	],
	preview: {
		select: {
			title: `slug.current`,
			subtitle: `sku`
		}
	}
}
