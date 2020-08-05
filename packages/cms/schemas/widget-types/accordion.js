import get from 'lodash/get'

export const AccordionRow = {
	title: `Accordion Row`,
	name: `accordionRow`,
	type: `object`,
	// icon,
	fields: [
		{
			title: `Label`,
			name: `label`,
			type: `string`,
		},
		{
			title: `Content`,
			name: `content`,
			type: `array`,
			of: [{ type: `block` }],
		},
	],

	preview: {
		select: {
			title: `label`,
		},
	},
}

export const AccordionWidget = {
	title: `Accordion`,
	name: `AccordionWidget`,
	type: `object`,
	fields: [
		{
			title: `Rows`,
			name: `rows`,
			type: `array`,
			of: [
				{ type: `accordionRow` },
			],
		},
	],
	preview: {
		select: {
			title: `rows`,
		},
		prepare(selection) {
			const title = get(selection, `title[0].label`)
			return {
				title: `Accordion`,
				subtitle: `${title}...`,
			}
		},
	},
}
