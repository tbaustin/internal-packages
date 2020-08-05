/** @jsx jsx */
import React, { forwardRef } from 'react'
import { jsx } from '@emotion/core'
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event'
import TextInput from 'part:@sanity/components/textfields/default'
import Fieldset from 'part:@sanity/components/fieldsets/default'
import { input as inputStyle } from './styles'


// Basic Sanity patch event to completely replace (overwrite) value
const createPatch = value => PatchEvent.from(
	value === ``
		? unset()
		: set(value),
)

/**
 * An individual custom field input
 * Uses the custom field's 'name' as a label, presents a Sanity text input
 */
function CustomFieldInput(props) {
	const { field, value, onChange } = props
	const { fieldType, name } = field || {}

  /**
   * Value should be a custom field entry object – get correct inner value
   * according to the custom field type (string, number, etc.)
   */
	const inputValue = value?.fieldValue?.[fieldType] || ``
	const inputId = `customFieldInput-${name}`

  /**
   * Pass the current field to the change handler
   * Sanity's text input component doesn't use a 'name' prop
   */
	const handleChange = e => onChange(e, field)

	return (
		<TextInput
			css={inputStyle}
			id={inputId}
			label={name}
			value={inputValue}
			onChange={handleChange}
		/>
	)
}


/**
 * The whole form containing all editable custom fields
 * Appearance mimics Sanity's default bordered fieldset w/ inputs inside
 */
export default forwardRef(function CustomFieldsForm(props, ref) {
	const { customFields, entries, onChange } = props

  /**
	 * Only show custom fields that are not marked as Salsify fields (i.e. no
	 * salsifyName set) and are not of type 'images'
	 */
	const editableFields = customFields.filter(f => {
		return !f?.salsifyName && f?.fieldType !== `images`
	})

  /**
   * Update the array of custom field entries for the product on every change
   * Find & update the entry corresponding to the changed field's name
   * Overwrites entire entries array w/ new one containing the change
   */
	function handleChange(event, field) {
		const newValue = event?.target?.value

    // Remove the old entry for the changed field (find by name)
		let newEntries = entries?.filter(e => e.fieldName !== field.name) || []

    // Push the new value as an entry replacing the one removed
		newEntries.push({
			fieldName: field?.name,
			fieldValue: {
        // Set correct sub-property here based on custom field's type
				[field.fieldType]: newValue
			}
		})

    /**
     * Create patch event here to send all the way up to parent onChange
     * This overwrites the entire array w/ new one created above
     */
		onChange(createPatch(newEntries))
	}

	return !editableFields.length ? null : (
		<Fieldset legend="Custom Fields" ref={ref}>
			{editableFields?.map(field => {
				const { _id, name } = field
				const entry = entries?.find(e => e.fieldName === name)

				return (
					<CustomFieldInput
						key={_id}
						field={field}
						value={entry}
						onChange={handleChange}
					/>
				)
			})}
		</Fieldset>
	)
})
