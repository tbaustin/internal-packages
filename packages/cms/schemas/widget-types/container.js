
export const ContainerWidget = {
	title: `Content Container`,
	name: `ContainerWidget`,
	type: `object`,
	fieldsets: [
		{
			title: `Layout Options`,
			name: `layout`,
			options: {
				collapsible: true,
			},
		},
	],
	fields: [
		{
			title: `Add outer margin`,
			name: `margin`,
			type: `boolean`,
			layout: `switch`,
			fieldset: `layout`,
		},
		{
			title: `Add permanent inner padding`,
			description: `Padding will always be applied`,
			name: `padding`,
			type: `boolean`,
			layout: `switch`,
			fieldset: `layout`,
		},
		{
			title: `Add smart inner padding`,
			description: (
				`Padding will not be applied if the screen is wider than this container
        (takes effect only for "Full width, constrained" below)`
			),
			name: `smartPadding`,
			type: `boolean`,
			layout: `switch`,
			fieldset: `layout`,
		},
		{
			title: `Width`,
			name: `width`,
			type: `string`,
			options: {
				list: [
					{ title: `Fit to content`, value: `fit` },
					{ title: `Full width`, value: `full` },
					{ title: `Full width, contstrained`, value: `constrained` },
				],
				layout: `radio`,
			},
			fieldset: `layout`,
		},
		{
			title: `Content Flow Direction`,
			name: `direction`,
			type: `string`,
			options: {
				list: [
					{
						title: `Vertical (content flows top to bottom)`,
						value: `column`,
					},
					{
						title: `Horizontal (content flows left to right)`,
						value: `row`,
					},
				],
				layout: `radio`,
			},
			fieldset: `layout`,
		},
		{
			title: `Content Alignment`,
			name: `align`,
			type: `string`,
			options: {
				list: [
					{ title: `Start (left or top)`, value: `flex-start` },
					{ title: `Middle`, value: `center` },
					{ title: `End (right or bottom)`, value: `flex-end` },
					{ title: `Stretch to Fill`, value: `stretch` }
				],
				layout: `radio`,
			},
			fieldset: `layout`,
		},
		{
			title: `Content`,
			name: `content`,
			type: `array`,
			of: [
				{ type: `block` },
				{ type: `ContainerWidget` },
				{ type: `ColorBoxWidget` },
				{ type: `BannerWidget` },
				{ type: `GalleryWidget` },
				{ type: `SliderWidget` },
				{ type: `DummyServerlessWidget` },
				{ type: `ProductListWidget` },
				{ type: `VideoListWidget` },
				{ type: `PriceStockWidget` },
				{ type: `AddToCartWidget` },
				{ type: `VariantSelectorWidget` }
			],
		},
	],
	preview: {
		select: {
			blocks: `content`,
		},
		prepare({ blocks }) {
			return {
				title: `Container`,
				subtitle: `Contains ${blocks.length} blocks`,
			}
		},
	},
}
