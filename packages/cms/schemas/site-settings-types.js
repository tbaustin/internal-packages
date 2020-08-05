
export const navigationLink = {
	name: `navigationLink`,
	title: `Navigation Link`,
	type: `object`,
	fields: [
		{ name: `title`, type: `string`, title: `Title` },
		{ name: `path`, type: `string`, title: `Path` },
		{ name: `image`, type: `image`, title: `Image/Icon`},
		{
			title: `Sub Links`,
			name: `subLinks`,
			type: `array`,
			of: [{ type: `navigationLink` }],
		},
	],
}


export const navigation = {
	name: `navigation`,
	title: `Navigation`,
	type: `object`,
	fields: [
		{
			name: `header`,
			title: `Header`,
			type: `array`,
			of: [{ type: `navigationLink` }],
		},
		{
			name: `footer`,
			title: `Footer`,
			type: `array`,
			of: [{ type: `navigationLink` }],
		}
	]
}


export const redirect = {
	name: `redirect`,
	title: `Redirect`,
	type: `object`,
	fields: [
		{ name: `from`, type: `string`, title: `Redirect From` },
		{ name: `to`, type: `string`, title: `Redirect To`},
	],
}


export const socialLink = {
	name: `socialLink`,
	title: `Social Link`,
	type: `object`,
	fields: [
		{ name: `link`, title: `Link`, type: `string` },
		{ name: `image`, title: `Image`, type: `image` },
		{
			name: `media`,
			title: `Media`,
			type: `string`,
			options: {
				list: [`facebook`, `twitter`, `instagram`, `pinterest`, `youtube`],
			},
		},
	],
}


export const siteSettings = {
	name: `siteSettings`,
	title: `Site Settings`,
	type: `document`,
	fields: [
		{ name: `title`, type: `string`, title: `Site Title` },
		{ name: `description`, type: `string`, title: `Site Description` },
		{
			name: `redirects`,
			type: `array`,
			title: `Redirects`,
			of: [{ type: `redirect` }],
		},
		{
			name: `socialLinks`,
			title: `Social Links`,
			type: `array`,
			of: [{ type: `socialLink` }],
		},
		{
			title: `Header Alert Bar Content`,
			name: `alertBarContent`,
			type: `array`,
			of: [{ type: `block` }]
		},
		{
			title: `Header Logo`,
			description: `File type must be SVG`,
			name: `headerLogo`,
			type: `image`,
			options: {
				accept: `.svg`
			},
		},
		{
			title: `Footer Content`,
			name: `footerContent`,
			type: `array`,
			of: [{ type: `block` }, { type: `image` }],
		},
		{
			title: `Navigation`,
			name: `navigation`,
			type: `navigation`,
		},
	],
}
