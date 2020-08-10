import * as widgetTypes from './widget-types'
import { FaFile as PageIcon } from 'react-icons/fa'
import { FaCopy as TemplateIcon} from 'react-icons/fa'
import { path as pathValidation } from '../validation'


// For use in 'content' array field below
const widgetChoices = Object.values(widgetTypes)
	.filter(t => t.name.endsWith(`Widget`))
	.map(w => ({ type: w.name }))


export const breadcrumbCategory = {
	name: `breadcrumbCategory`,
	title: `Category for Breadcrumb`,
	type: `object`,
	fields: [
		{
			title: `Choose Source for Category`,
			description: `Use one of the methods below to select a category`,
			name: `dataSource`,
			type: `variableCategory`
		},
		{
			title: `Insert Crumbs for Parent Categories`,
			name: `insertParentCategories`,
			type: `boolean`,
		},
		{
			title: `Disable hyperlink for last category`,
			name: `disableLastLink`,
			type: `boolean`,
		},
	],
	options: {
		collapsible: true,
		collapsed: true,
	},
}

export const breadcrumb = {
	name: `breadcrumb`,
	title: `Breadcrumb`,
	type: `object`,
	fields: [
		{
			name: `title`,
			title: `Title`,
			type: `string`,
		},
		{
			name: `path`,
			title: `Path`,
			type: `string`,
			validation: pathValidation({
				template: true,
				required: false,
			}),
		},
		{
			name: `category`,
			title: `Link a Category`,
			type: `breadcrumbCategory`,
		},
	],
}


/**
 * Schema fields are slightly different between pages & templates
 * Use function to dynamically generate them
 */
const getFields = isTemplate => {
	const title = isTemplate ? `Template` : `Page`

	let description = (
		`Path where the page will be accessed. `
    + `Must start with a slash `
    + `and cannot contain spaces or special characters.`
	)

	if (isTemplate) description += `
    Double curly braces for variables are allowed.
  `

	return [
		{
			name: `name`,
			title: `${title} Name`,
			description: `For reference only`,
			type: `string`,
			validation: Rule => Rule.required(),
		},
		{
			name: `title`,
			title: `${title} Title`,
			type: `string`,
		},
		{
			name: `path`,
			title: `${title} Path`,
			description,
			type: `string`,
			validation: pathValidation({
				template: isTemplate,
				required: true,
			}),
		},
		{
			name: `breadcrumbs`,
			title: `Breadcrumbs`,
			type: `array`,
			of: [{ type: `breadcrumb` }],
		},
		{
			name: `content`,
			title: `Content`,
			type: `array`,
			of: [
				{ type: `block` },
				...widgetChoices,
			],
		},
	]
}


// Preview title & icon different between pages & templates
const getPreview = isTemplate => ({
	select: {
		title: `name`,
		path: `path`,
	},
	prepare({ title, path }) {
		return {
			title,
			subtitle: path,
			media: isTemplate ? TemplateIcon : PageIcon,
		}
	},
})


// The final document type for Pages
export const page = {
	name: `page`,
	title: `Page`,
	type: `document`,
	fields: getFields(false),
	preview: getPreview(false),
}


// The final document type for Templates
export const template = {
	name: `template`,
	title: `Template`,
	type: `document`,
	fields: getFields(true),
	preview: getPreview(true),
}
