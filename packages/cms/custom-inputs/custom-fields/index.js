import React, { forwardRef, useState, useEffect } from 'react'
import sanityClient from 'part:@sanity/base/client'
import { withDocument } from 'part:@sanity/form-builder'
import SalsifyDisplay from './salsify-display'
import CustomFieldsForm from './form'
import ImageLists from './image-lists'


/**
 * The entire "Custom Fields" area in a product editor pane
 * Contains a form section for editable fields, display table for fields from
 * Salsify, and reorderable lists of images (for Salsify image list fields)
 */
export default withDocument(
	forwardRef(function CustomFields(props, ref) {
		const { value, onChange, document } = props
		const [customFields, setCustomFields] = useState([])

		// Get the metadata for all custom fields on 1st render
		useEffect(() => {
			const loadFields = async () => {
				const query = `*[ _type == "customField" ]{ ... }`
				const data = await sanityClient.fetch(query)
				setCustomFields(data)
			}

			loadFields()
		}, [])

		return (
			<>
				<CustomFieldsForm
					ref={ref}
					customFields={customFields}
					entries={value}
					onChange={onChange}
				/>
				<SalsifyDisplay
					product={document}
					customFields={customFields}
				/>
				<ImageLists
					customFields={customFields}
					onChange={onChange}
					entries={value}
				/>
			</>
		)
	}),
)
