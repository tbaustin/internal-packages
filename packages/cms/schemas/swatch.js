
export default {
	name: `swatch`,
	title: `Swatches`,
	type: `document`,
	fields: [
		{
			name: `primaryImage`,
			title: `Primary Image`,
			type: `image`,
		},
		{
			name: `secondaryImage`,
			title: `Secondary Image`,
			type: `image`,
		},
		{
			name: `color`,
			title: `Color`,
			type: `color`,
		},
		{
			name: `value`,
			title: `Value on Product`,
			type: `string`,
			description: `This must match exactly to what the value is on the product`,
		},
		{
			name: `customFieldRef`,
			title: `Custom Field`,
			type: `reference`,
			to: [{ type: `customField` }],
			options: {
				filter: `fieldType == $fieldType`,
				filterParams: { fieldType: `string` },
			},
		},
	],
}
