
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
			type: `string`,
		},
		{
			name: `useAsName`,
			title: `Use this field as the product name`,
			type: `boolean`
		},
		{
			name: `useAsListImage`,
			title: `Use this field for product list tile images`,
			description: `Each product will use its first image in this group`,
			type: `boolean`
		},
		{
			name: `attributeWidget`,
			title: `Attribute Widget`,
			type: `string`,
			options: {
				list: [
					{ title: `Generic Dropdown`, value: `GenericWidget` }
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
					{ title: `True/False`, value: `boolean` },
					{ title: `Number`, value: `number` },
					{ title: `Images`, value: `images` },
				],
			},
		},
	],
	initialValue: {
		useAsName: false
	}
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
				isHighlighted: true
			}
		},
		{
			title: `Displayed`,
			name: `displayed`,
			type: `boolean`,
			options: {
				isHighlighted: true
			}
		},
		{
			title: `Alt Text`,
			description: `Appears in place of the image if it fails to load`,
			name: `altText`,
			type: `string`,
			options: {
				isHighlighted: true
			}
		}
	]
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
				{ type: `customFieldImage` }
			]
		}
	]
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
