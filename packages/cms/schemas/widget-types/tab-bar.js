export const TabItem = {
	title: `Tab Item`,
	name: `tabItem`,
	type: `object`,
	fields: [
		{ name: `container`, title: `Container`,  type: `ContainerWidget` },
		{ name: `title`, title: `Title`, type: `string` },
	],
}

export const TabBarWidget = {
	title: `Tab Bar Widget`,
	name: `TabBarWidget`,
	type: `object`,
	fields: [
		{
			title: `Tabs`,
			name: `tabs`,
			type: `array`,
			of: [
				{ type: `tabItem` },
			],
		},
	],
}