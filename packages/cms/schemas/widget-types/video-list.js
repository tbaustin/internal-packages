export const VideoListUpload = {
	name: `videoListUpload`,
	title: `Video List Upload`,
	type: `object`,
	fields: [
		{ title: `Upload`, name: `upload`, type: `upload` },
		{ title: `Title`, name: `title`, type: `string` },
	],
}

export const VideoListItem = {
	title: `Video List Item`,
	name: `videoListItem`,
	type: `object`,
	fields: [
		{
			title: `Title`,
			name: `title`,
			type: `string`,
		},
		{
			title: `Videos`,
			name: `videos`,
			type: `array`,
			of: [{ type: `videoListUpload`}],
		},
	],
}

export const VideoListWidget = {
	title: `Video List`,
	name: `VideoListWidget`,
	type: `object`,
	fields: [
		{
			title: `Use Template Variable`,
			description: `
        For templates only: if the data source (e.g. category or product) has
        a video field, you can type the name of that field here instead of
        selecting/uploading an image above. Do not include curly braces.
      `,
			name: `templateVariable`,
			type: `string`,
		},
		{
			title: `Video List`,
			name: `videoList`,
			type: `array`,
			of: [{ type: `videoListItem`}],
		},
	],
}