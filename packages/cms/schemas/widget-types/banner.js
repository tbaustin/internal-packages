
export const BannerWidget = {
	title: `Banner`,
	name: `BannerWidget`,
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
		{
			title: `Size`,
			name: `size`,
			type: `string`,
			options: {
				list: [`short`, `medium`, `tall`],
				isHighlighted: true,
			},
		},
		{
			title: `Header`,
			name: `header`,
			type: `string`,
			options: {
				isHighlighted: true,
			},
		},
		{
			title: `Sub Header`,
			name: `subHeader`,
			type: `string`,
			options: {
				isHighlighted: true,
			},
		},
	],
}
