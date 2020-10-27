
export const customField = {
	name: `customField`,
	title: `Custom Field`,
	type: `document`,
	fields: [
		{
			name: `name`,
			title: `Custom Field Name`,
			type: `string`,
		},
		{
			name: `salsifyName`,
			title: `Salsify Property Name (must match exactly)`,
			description: `If specified, the value of the matching property in `
				+ `Salsify will sync to this field. It will no longer be editable via `
				+ `the CMS, with the exception of changing order and some other `
				+ `settings when Field Type below is "Image List."`,
			type: `string`,
		},
		{
			name: `useAsName`,
			title: `Use for product names`,
			description: `If checked, this field's value will be used for product `
				+ `names displayed throughout the CMS and in Product Lists throughout `
				+ `the site.`,
			type: `boolean`,
		},
		{
			name: `useAsListImage`,
			title: `Use for product list images`,
			description: `If checked, each tile in every Product List will show the `
				+ `first image in the product's value for this field. Field Type below `
				+ `must be "Image List."`,
			type: `boolean`,
		},
		{
			name: `attributeWidget`,
			title: `Product Overview Filter`,
			description: `Allows customers to filter by this field in a Product `
				+ `Overview to choose a specific variant`,
			type: `string`,
			options: {
				list: [
					{ title: `Generic Dropdown`, value: `GenericWidget` },
				],
			},
		},
		{
			name: `filterWidget`,
			title: `Product List Filter`,
			description: `Allows customers to filter products by this field in `
				+ `Product Lists`,
			type: `string`,
			options: {
				list: [
					{ title: `List Filter`, value: `FilterList` },
					{ title: `Swatch Filter`, value: `FilterSwatch` },
				],
			},
		},
		{
			name: `fieldType`,
			title: `Field Type`,
			type: `string`,
			options: {
				list: [
					{ title: `Text`, value: `string` },
					/**
					 * The below types are commented out temporarily; custom inputs and
					 * site code currently do nothing different with them and treat them
					 * as "Text" types; implementation to be finished eventually...
					 */
					// { title: `True/False`, value: `boolean` },
					// { title: `Number`, value: `number` },
					{ title: `Image List`, value: `images` },
				],
			},
		},
	],
	initialValue: {
		useAsName: false,
	},
}


export const customFieldImage = {
	name: `customFieldImage`,
	type: `image`,
	fields: [
		{
			title: `External URL`,
			description: `Use an image from another site instead of uploading one`,
			name: `externalUrl`,
			type: `url`,
			options: {
				isHighlighted: true,
			},
		},
		{
			title: `Displayed`,
			name: `displayed`,
			type: `boolean`,
			options: {
				isHighlighted: true,
			},
		},
		{
			title: `Alt Text`,
			description: `Appears in place of the image if it fails to load`,
			name: `altText`,
			type: `string`,
			options: {
				isHighlighted: true,
			},
		},
	],
}


export const customFieldValue = {
	name: `customFieldValue`,
	type: `object`,
	fields: [
		{
			name: `string`,
			title: `Text`,
			type: `string`,
		},
		{
			name: `number`,
			title: `Number`,
			type: `number`,
		},
		{
			name: `boolean`,
			title: `True/False`,
			type: `boolean`,
		},
		{
			name: `images`,
			title: `Images`,
			type: `array`,
			of: [
				{ type: `customFieldImage` },
			],
		},
	],
}


export const customFieldEntry = {
	name: `customFieldEntry`,
	type: `object`,
	fields: [
		{
			name: `fieldName`,
			type: `string`,
		},
		{
			name: `fieldValue`,
			type: `customFieldValue`,
		},
	],
}
