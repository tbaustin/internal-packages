import HTMLInput from '../../custom-inputs/html-input'


export const featureTile = {
	title: `Feature Tile`,
	name: `featureTile`,
	type: `object`,
	fields: [
		{
			title: `Background Image`,
			name: `img`,
			type: `image`,
		},
		{
			title: `Size`,
			name: `size`,
			type: `string`,
			options: {
				list: [`short`, `medium`, `tall`],
			},
		},
		{
			title: `Header`,
			name: `header`,
			type: `array`,
			of: [{ type: `block` }, { type: `image` }],
		},
		{
			title: `Sub Header`,
			name: `subHeader`,
			type: `array`,
			of: [{ type: `block` }, { type: `image` }],
		},
		{
			title: `Button`,
			name: `button`,
			type: `string`,
		},
		{
			title: `HTML`,
			name: `html`,
			type: `string`,
			inputComponent: HTMLInput,
		},
		{
			title: `Link`,
			name: `link`,
			type: `string`,
		},
		{
			title: `Color`,
			name: `color`,
			type: `color`,
		},
	],
	preview: {
		select: {
			media: `img`,
		},
		prepare(selection) {
			return {
				title: `Feature Tile`,
				media: selection.media,
			}
		},
	},
}

export const FeatureTilesWidget = {
	title: `Feature Tiles`,
	name: `FeatureTilesWidget`,
	type: `object`,
	fields: [
		{
			title: `Use Template Variable`,
			description: `
        For templates only: if the data source (e.g. category or product) has
        a feature tile field, you can type the name of that field here instead of
        selecting/uploading an image above. Do not include curly braces.
      `,
			name: `templateVariable`,
			type: `string`,
		},
		{
			title: `Title`,
			name: `title`,
			type: `string`,
		},
		{
			title: `Background`,
			name: `background`,
			type: `string`,
			options: {
				list: [`grey`, `light-grey`],
			},
		},
		{
			title: `Tiles`,
			name: `tiles`,
			type: `array`,
			of: [{ type: `featureTile`}],
		},
	],
}
