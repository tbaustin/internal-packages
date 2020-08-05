/** @jsx jsx */
import React, { forwardRef, useState, useReducer, useRef } from 'react'
import { jsx } from '@emotion/core'
import sanityClient from 'part:@sanity/base/client'
import PatchEvent, { set } from 'part:@sanity/form-builder/patch-event'
import { buildSalsifyImageUrl } from '@escaladesports/utils'
import Switch from 'part:@sanity/components/toggles/switch'
import SortableList from '../sortable-list'
import Viewer from './viewer'
import { AltTextDisplay, AltTextEditor } from './alt-text'
import { item as style } from './styles'

/**
 * Reorderable list input for custom fields of type 'images' (array of images)
 *
 * Allows reordering the list; does not allow adding/deleting/re-uploading
 * assets or changing source URLs
 *
 * Shows thumbnails for the images, allows user to view full-size image in a
 * modal window on click
 *
 * Each row includes an editor UI for "altText" subfield & a toggle switch for
 * "displayed" subfield
 *
 */
export default forwardRef(function ImageList(props, ref) {
	const { options, type, value, onChange, createPatchEvent } = props

	/**
	 * To track array position of image being edited via dialog
	 * Does not apply to toggling switch directly on the row
	 */
	const [activeIndex, setActiveIndex] = useState(null)

	// The image being edited/viewed via dialog
	const activeItem = value?.[activeIndex] || {}

	// String identifier for type of dialog currently open
	const [activeDialog, setActiveDialog] = useState(``)

	// Refs for the list item elements
	const [itemRefs, setItemRefs] = useReducer(
		(state, action) => ({ ...state, ...action }),
		{}
	)

	// Element corresponding to image being edited/viewed
	const activeItemElement = itemRefs[activeIndex]?.current

	/**
	 * Replaces the given index in value array w/ new item given, calls parent
	 * onChange() with properly-formed Sanity patch
	 */
	const triggerChange = (item, index) => {
		const newValue = [ ...value ]
		newValue[index] = item

		// Create the Sanity patch event using custom function if supplied
		const patch = createPatchEvent
			? createPatchEvent?.(newValue)
			: PatchEvent.from(set(newValue))

		onChange(patch)
	}


	// For toggling the "displayed" switch on one of the images/rows
	const handleToggle = (e, index) => {
		const displayed = e?.target?.checked
		const item = value?.[index] || {}
		const clonedItem = { ...item, displayed }
		triggerChange(clonedItem, index)
	}

	// For updating the "altText" field on one of the images
	const handleChangeAltText = altText => {
		const clonedItem = { ...activeItem, altText }
		triggerChange(clonedItem, activeIndex)
		closeDialog()
	}


	// Open/close a dialog & set index of the image being viewed/edited
	const openDialog = (dialogName, index) => {
		setActiveIndex(index || 0)
		setActiveDialog(dialogName || ``)
	}

	const closeDialog = () => {
		setActiveIndex(null)
		setActiveDialog(``)
	}


	// Render each row with the thumbnail, alt text field & "Displayed" switch
  const renderItem = (item, i) => {
    const { _key, externalUrl, altText, displayed } = item

		const itemRef = useRef()
		if (!itemRefs[i]) setItemRefs({ [i]: itemRef })

		const thumbUrl = buildSalsifyImageUrl(externalUrl, { width: 50 })

    return (
      <div css={style}>
        <img
					src={thumbUrl}
					onClick={() => openDialog(`image`, i)}
				/>
				<AltTextDisplay
					ref={itemRef}
					altText={altText}
					onClick={() => openDialog(`altText`, i)}
				/>
        <Switch
          onChange={e => handleToggle(e, i)}
          label="Displayed"
          checked={!!displayed}
        />
      </div>
    )
  }

	return (
		<>
			<Viewer
				isActive={activeDialog === `image`}
				activeItem={activeItem}
				onClose={closeDialog}
			/>
			<AltTextEditor
				isActive={activeDialog === `altText`}
				popOverElement={activeItemElement}
				activeItem={activeItem}
				onSave={handleChangeAltText}
				onClose={closeDialog}
			/>
      <SortableList
				ref={ref}
        options={options}
        type={type}
        value={value}
				createPatchEvent={createPatchEvent}
        onChange={onChange}
        renderItem={renderItem}
      />
		</>
	)
})
