

export const aspectRatio = {
	title: `Aspect Ratio`,
	name: `aspectRatio`,
	type: `object`,
	fields: [
		{ title: `Height (px)`, name: `height`, type: `number` },
		{ title: `Width (px)`, name: `width`, type: `number` },
	],
}


export const videoSpec = {
	title: `Video Spec`,
	name: `videoSpec`,
	type: `object`,
	fields: [
		{ title: `Aspect Ratio`, name: `aspectRatio`, type: `aspectRatio` },
		{ title: `Maximum Width of Video (px)`, name: `maxWidth`, type: `number` },
	],
}


export const nonFile = {
	title: `Non File Upload`,
	name: `nonFile`,
	type: `object`,
	fields: [
		{
			title: `Youtube URL`,
			name: `url`,
			type: `string`,
		},
		{
			title: `YoutubeID`,
			name: `youtubeID`,
			type: `string`,
		},
	],
}

export const Upload = {
	title: `Upload`,
	name: `upload`,
	type: `object`,
	fields: [
		{ title: `Non File Upload`, name: `nonFile`, type: `nonFile` },
		// { title: `File Upload`, name: `file`, type: `file` },
	],
}


export const VideoWidget = {
	title: `Video`,
	name: `VideoWidget`,
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
			title: `Constraints`,
			name: `specs`,
			type: `videoSpec`,
		},
		{
			title: `Uploads`,
			name: `upload`,
			type: `upload`,
		},
	],
}
