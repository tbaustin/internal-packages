export const ContentWithMediaWidget = {
	name: `ContentWithMediaWidget`,
	title: `Content With Media`,
	type: `object`,
	fields: [
		{ 
			name: `video`, 
			title: `Video`, 
			type: `upload`,
			description: `This will override any other media`, 
		},
		{ name: `image`, title: `Image`, type: `image` },
		{ name: `mediaFirst`, title: `Media First`, type: `boolean` },
		{ name: `header`, title: `Header`, type: `string` },
		{ 
			name: `content`,
			title: `Content`,
			type: `array`,
			of: [{ type: `block` }, { type: `ButtonWidget`}],
		},
	],
}