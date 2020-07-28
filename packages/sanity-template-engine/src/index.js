import _get from 'lodash/get'
import sampleSchema from './sample-schema'


/**
 * Sanity schema to be used by parser
 * Use sample schema as fallback
 */
let schema = sampleSchema


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
		 * Allow accessing members of arrays via numeric path segments
		 * Treat 1 as first instead of 0 (more intuitive for non-dev CMS users)
		 * i.e. "Some List:1" might translate to "someList[0]"
		 *
		 * If the segment is numeric, add the square bracket array accessor (as
		 * long as the corresponding type/field in the schema is actually an array
		 * type) & then move on to next segment
		 */
		let segmentIsNumber = /^\d+$/.test(segment)
		if (segmentIsNumber) {
			let index = Math.max(segment - 1, 0)

			if (cursor.type === `array`) {
				let contents = cursor.of?.[0] || {}

				let nextCursorType = contents.type === `reference`
					? contents.to?.[0]?.type
					: contents.type

				let nextCursor = schema.find(t => t.name === nextCursorType)
				if (nextCursor) cursor = nextCursor

				return `${dotPath}[${index}]`
			}

			return dotPath
		}

		/**
     * Find inner field that has title matching current segment; point the
     * reference cursor at that field OR any matching top-level schema type
		 * (based on the field's type or the referenced schema type if the field
		 * type is 'reference')
     */
		let prop = ``
		if (cursor.fields) {
			let foundField = cursor.fields.find(f => f.title === segment) || {}
			/**
	     * As long as a field has been found above, use its 'name' property from
			 * the schema as the new property for the converted path
	     */
			prop = foundField.name || ``
			/**
	     * Values for Sanity's slug types are objects with an inner 'current'
	     * property; append this if current segment is a slug type (as long as
	     * string has been found for property)
	     */
			if (foundField.type === `slug`) prop += `.current`

			let nextCursorType = foundField.type === `reference`
				? foundField.to?.[0]?.type
				: foundField.type

			let nextCursor = schema.find(type => type.name === nextCursorType)
			cursor = nextCursor || foundField
		}

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
	return _get(data, dotPath) || ``
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
