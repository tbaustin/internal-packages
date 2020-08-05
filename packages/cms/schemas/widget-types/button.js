export const ButtonWidget = {
	name: `ButtonWidget`,
	title: `Button Widget`,
	type: `object`,
	fields: [
		{ name: `text`, title: `Text`, type: `string` },
		{ name: `link`, title: `Link`, type: `string` },
		{ 
			name: `bgColor`, 
			title: `Background Color`, 
			type: `string`,
			options: {
				list: [`red`, `white`],
			}, 
		},
		{ 
			name: `borderColor`, 
			title: `Border Color`, 
			type: `string`,
			options: {
				list: [`red`, `white`],
			}, 
		},
		{
			name: `textColor`,
			title: `Text Color`,
			type: `string`,
			options: {
				list: [`white`, `red`],
			},
		},
	],
}