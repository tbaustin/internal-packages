/**
 * YO!!
 *
 * PLEASE READ!!!!!!!
 *
 * Normally, you'd want to join all your Sanity schemas here, BUT...
 * Please add them over in persist.js instead.
 *
 * The reason is explained in that file.
 *
 */

import createSchema from 'part:@sanity/base/schema-creator'
import baseSchemaTypes from 'all:part:@sanity/base/schema-type'
import persistedSchema, { schemaTypes } from './persist'


export default createSchema({
	name: `default`,
	types: baseSchemaTypes.concat([
		persistedSchema,
		...schemaTypes,
	]),
})
