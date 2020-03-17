const attributes = {
	color: {
		label: `Color`,
		section: `sectionOne`,
		component: `CompOne`,
		options: [],
	},
	size: {
		label: `Size`,
		section: `sectionOne`,
		component: `CompTwo`,
		options: [],
	},
	unit: {
		label: `unit`,
		section: `sectionTwo`,
		component: `CompThree`,
		options: [],
	},
}

const variants = [
	{
		sku: `1`,
		name: `Product One`,
		color: `Yellow`,
		size: `Small`,
		unit: `pounds`,
	},
	{
		sku: `2`,
		name: `Product Two`,
		color: `Yellow`,
		size: `Medium`,
		unit: `pounds`,
	},
	{
		sku: `3`,
		name: `Product Three`,
		color: `Yellow`,
		size: `Large`,
		unit: `grams`,
	},
	{
		sku: `4`,
		name: `Product Four`,
		color: `Blue`,
		size: `Small`,
		unit: `pounds`,
	},
	{
		sku: `5`,
		name: `Product Five`,
		color: `Blue`,
		size: `Medium`,
		unit: `pounds`,
	},
	{
		sku: `6`,
		name: `Product Six`,
		color: `Purple`,
		size: `Small`,
		unit: `grams`,
	},
	{
		sku: `7`, 
		name: `Product Seven`, 
		color: `Green`,
		size: `Small`,
		unit: `pounds`,
	},
]

export default {
	attributes,
	variants,
}
