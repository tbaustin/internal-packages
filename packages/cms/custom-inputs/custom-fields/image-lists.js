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

		/**
		 * Replace existing image list w/ new one on the corresponding entry
		 * Add an entry for the custom field if it doesn't exist
		 */
		const newEntries = [...entries]
		const updatedEntry = {
			fieldName: name,
			fieldValue: {
				images: newImageListValue,
			}
		}
		if (updateIdx === -1) newEntries.push(updatedEntry)
		else newEntries[updateIdx] = updatedEntry

		return PatchEvent.from(set(newEntries))
	}

	return (
		<>
			{imageFields.map(field => {
				const { _id, name, title, salsifyName } = field
				const entry = entries?.find(e => e.fieldName === name)
				const value = entry?.fieldValue?.images
				const listTitle = salsifyName ? `${name} (Salsify)` : name

				const shouldHide = !entry && salsifyName

				return shouldHide ? null : (
					<ImageList
						key={_id}
						type={{ title: listTitle }}
						createPatchEvent={createPatch(name)}
						onChange={onChange}
						value={value}
						allowAddAndRemove={!salsifyName}
					/>
				)
			})}
		</>
	)
}
