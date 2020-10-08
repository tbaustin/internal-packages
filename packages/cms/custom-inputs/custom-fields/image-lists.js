import React from 'react'
import PatchEvent, { set } from 'part:@sanity/form-builder/patch-event'
import ImageList from '../image-list'


/**
 * Renders a custom image list input for each custom field of type 'images'
 */
export default function ImageLists(props) {
	const { customFields, onChange, entries } = props

	const imageFields = customFields.filter(f => f.fieldType === `images`)

	/**
   * Only one image list gets changed at a time, but the Sanity patch event
   * needs to happen for the entire array of customFieldEntries since that is
   * the actual field value
   *
   * This custom patch creator used by <ImageList> receives the new version of
   * the image list that was changed & creates a patch event containing all
   * customFieldEntries (image list within corresponding customFieldEntry gets
   * overwritten)
   */
	const createPatch = name => newImageListValue => {
		// Get the position of this image list in the custom field entries
		const updateIdx = entries.findIndex(e => e.fieldName === name)

		// Replace existing image list w/ new one on the corresponding entry
		const newEntries = [...entries]
		newEntries[updateIdx] = {
			fieldName: name,
			fieldValue: {
				images: newImageListValue,
			},
		}

		return PatchEvent.from(set(newEntries))
	}

	return (
		<>
			{imageFields.map(field => {
				const { _id, name, title, salsifyName } = field
				const entry = entries?.find(e => e.fieldName === name)
				const value = entry?.fieldValue?.images

				const finalValue = value?.map?.(img => ({
					...img,
					_type: `customFieldImage`,
				}))

				return !entry ? null : (
					<ImageList
						key={_id}
						type={{ title: name }}
						createPatchEvent={createPatch(name)}
						onChange={onChange}
						value={value}
					/>
				)
			})}
		</>
	)
}
