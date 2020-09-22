import HTMLInput from '../../custom-inputs/html-input'


export * from './slider'
export * from './gallery'
export * from './container'
export * from './video'
export * from './video-list'
export * from './banner'
export * from './feature-tiles'
export * from './test-variant-selector'
export * from './variant-selector'
export * from './tab-bar'
export * from './content-with-media'
export * from './button'
export * from './accordion'
export * from './product-widgets'
export * from './active-campaign'

export const DealerWidget = {
	title: `Dealer Map`,
	name: `DealerWidget`,
	type: `object`,
	fields: [
		{ name: `proximitySearch`, title: `Use Proximity Search`, type: `boolean` },
	],
}

export const CustomHTMLWidget = {
	title: `HTML`,
	name: `CustomHTMLWidget`,
	type: `object`,
	fields: [
		{
			title: `Use Template Variable`,
			description: `
        For templates only: if the data source (e.g. category or product) has
        a html field, you can type the name of that field here instead of
        selecting/uploading an image above. Do not include curly braces.
      `,
			name: `templateVariable`,
			type: `string`,
		},
		{
			name: `html`,
			title: `HTML`,
			type: `string`,
			inputComponent: HTMLInput,
		},
	],
}

export const seoObj = {
	name: `seoObj`,
	title: `Seo Object`,
	type: `object`,
	fields: [
		{
			title: `SEO Title`,
			name: `seoTitle`,
			type: `string`,
		},
		{
			title: `SEO Description`,
			name: `seoDescription`,
			type: `string`,
		},
		{
			title: `H1 Tag`,
			name: `h1Tag`,
			type: `string`,
		},
	],
}

export const SeoWidget = {
	title: `SEO`,
	name: `SeoWidget`,
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
		{ type: `seoObj`, name: `seoObj`, title: `Seo Fields` },
	],
}

export const ColorBoxWidget = {
	title: `Color Box`,
	name: `ColorBoxWidget`,
	type: `object`,
	fields: [
		{
			title: `Text`,
			name: `text`,
			type: `string`,
		},
		{
			title: `Color`,
			name: `color`,
			type: `string`,
		},
	],
}

export const DummyServerlessWidget = {
	title: `Dummy Serverless Data`,
	name: `DummyServerlessWidget`,
	type: `object`,
	fields: [
		{
			title: `Enabled`,
			name: `enabled`,
			type: `boolean`,
			hidden: true,
		},
	],
}
