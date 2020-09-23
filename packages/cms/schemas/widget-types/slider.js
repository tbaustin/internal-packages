
export const SliderWidget = {
	title: `Slider`,
	name: `SliderWidget`,
	type: `object`,
	fields: [
		{
			name: `items`,
			title: `Items`,
			type: `array`,
			of: [{ type: `heroImage` }]
		}
	],
	preview: {
		select: {
			items: `items`
		},
		prepare(selection) {
			const { items } = selection

			const subtitle = items?.length
				? `${items.length} slide(s)`
				: `No slides`

			return { title: `Slider`, subtitle }
		}
	}
}
