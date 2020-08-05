import HTMLInput from '../../custom-inputs/html-input'


export const carouselImage = {
	title: `Carousel Image`,
	name: `carouselImage`,
	type: `image`,
	fields: [
		{
			title: `Size`,
			name: `size`,
			type: `string`,
			options: {
				list: [`short`, `medium`, `tall`],
				isHighlighted: true,
			},
		},
	],
}

export const carouselItem = {
	title: `Carousel Item`,
	name: `carouselItem`,
	type: `object`,
	preview: {
		select: {
			media: `image`,
			title: `link`,
		},
	},
	fields: [
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
			title: `Image`,
			name: `image`,
			type: `carouselImage`,
		},
	],
}

export const CarouselWidget = {
	title: `Carousel`,
	name: `CarouselWidget`,
	type: `object`,
	fields: [
		{
			title: `Use Template Variable`,
			description: `
        For templates only: if the data source (e.g. category or product) has
        a carousel field, you can type the name of that field here instead of
        selecting/uploading an image above. Do not include curly braces.
      `,
			name: `templateVariable`,
			type: `string`,
		},
		{
			name: `useBannerStyle`,
			title: `Use Banner Style`,
			description: `Full-width, promo-style slides`,
			type: `boolean`
		},
		{
			name: `items`,
			title: `Items`,
			type: `array`,
			of: [{ type: `carouselItem` }],
		},
	],
}
