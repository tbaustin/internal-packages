

export const bannerImage = {
	title: `Banner Image`,
	name: `bannerImage`,
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
			title: `Size/Ratio Options`,
			name: `sizeOptions`,
			type: `heroImageSize`,
			options: {
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


export const BannerWidget = {
	title: `Banner`,
	name: `BannerWidget`,
	type: `object`,
	fields: [
		{
			title: `Image (Mobile)`,
			name: `mobileImage`,
			type: `bannerImage`,
		},
		{
			title: `Image (Desktop)`,
			description: `If no image is selected, the mobile image will be used.`,
			name: `desktopImage`,
			type: `bannerImage`,
		}
	]
}
