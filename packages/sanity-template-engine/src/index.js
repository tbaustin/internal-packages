import 'core-js'
import 'regenerator-runtime/runtime'
import _get from 'lodash/get'


/**
 * Sanity schema to be used by parser
 * Sample written out below as fallback
 */
let schema = [{
	name: `person`,
	title: `Person`,
	type: `document`,
	fields: [
		{
			name: `name`,
			title: `Full Name`,
			type: `object`,
			fields: [
				{ name: `first`, title: `First Name` },
				{ name: `last`, title: `Last Name` },
			],
		},
	],
}]


/**
 * The data source used by the parser; values are substituted from this object
 */
let defaultData = {}


/**
 * Converts a colon-separated path of field titles to a dot-separated path of
 * field names
 *
 * Example: converts "Full Name:First Name" to "name.first" for schema above
 */
const convertPath = (colonPath = ``, data = {}) => {
	// Return an empty string for null arguments
	if (!colonPath || !data) return ``

	// Find the data source's type in the schema & set reference cursor there
	let cursor = schema.find(type => type.name === data._type)

	// Don't continue if nothing found above (or if path is empty)
	if (!cursor) return ``

	// Construct the converted path
	const segments = colonPath.split(`:`)
	return segments.reduce((dotPath, segment) => {
		/**
     * Find inner field that has title matching current segment; point the
     * reference cursor at it
     */
		if (cursor.fields) {
			let foundField = cursor.fields.find(f => f.title === segment)
			cursor = foundField || {}
		}

		/**
     * As long as a field has been found above, use its 'name' property from the
     * schema as the new property for the converted path
     */
		let prop = cursor.title === segment ? cursor.name : null

		/**
     * Values for Sanity's slug types are objects with an inner 'current'
     * property; append this if current segment is a slug type (as long as
     * string has been found for property)
     */
		if (prop && cursor.type === `slug`) prop += `.current`

		/**
     * Add property to the path; use dot in between if property has been found
     * and new path already has text
     */
		let separator = dotPath.length && prop ? `.` : ``
		return [dotPath, prop].join(separator)
	}, ``)
}


/**
 * Gets value for a single property using colon-separated path of field titles
 */
const resolveProperty = (colonPath, data = defaultData) => {
	const dotPath = convertPath(colonPath, data)
	return _get(data, dotPath)
}


/**
 * Parses a text excerpt containing template variables in double curly braces
 * Replaces the template variables w/ values from 2nd arg according to schema
 */
const parse = (excerpt, data) => {
	if (!excerpt) return ``

	const regex = /{{([^{}]+)}}/g

	return excerpt.replace(regex, (match, colonPath) => {
		return resolveProperty(colonPath, data)
	})
}


/**
 * Main function for instantiating the template engine
 */
export default function TemplateEngine(options) {
	const { schema: customSchema, data } = options

	if (customSchema) schema = customSchema
	if (data) defaultData = data

	return {
		parse,
		resolveProperty,
		schema,
		data: defaultData,
	}
}
