/** @jsx jsx */
import React, { forwardRef, useState, useEffect, createRef } from 'react'
import { jsx } from '@emotion/core'
import PatchEvent, { set } from 'part:@sanity/form-builder/patch-event'
import { buildSalsifyImageUrl } from '@escaladesports/utils'
import Switch from 'part:@sanity/components/toggles/switch'
import Button from 'part:@sanity/components/buttons/default'
import TrashIcon from 'part:@sanity/base/trash-icon'
import SortableList from '../sortable-list'
import Viewer from './viewer'
import { AltTextDisplay, AltTextEditor } from './alt-text'
import AddModal from './add-modal'
import { item as style } from './styles'

/**
 * Reorderable list input for custom fields of type 'images' (array of images)
 *
 * Allows reordering the list; optionally allows adding/deleting images (only
 * external URLs supported currently – no asset upload)
 *
 * Shows thumbnails for the images, allows user to view full-size image in a
 * modal window on click
 *
 * Each row includes an editor UI for "altText" subfield, toggle switch for
 * "displayed" subfield, and delete button (if enabled)
 *
 */
export default forwardRef(function ImageList(props, ref) {
	const {
		options,
		type,
		value,
		onChange,
		createPatchEvent,
		allowAddAndRemove
	} = props

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
	const [itemRefs, setItemRefs] = useState([])
	const numItems = value?.length
	useEffect(() => {
		setItemRefs(prevRefs => {
			return Array(numItems)
				.fill()
				.map((_, i) => prevRefs[i] || createRef())
		})
	}, [numItems])

	// Element corresponding to image being edited/viewed
	const activeItemElement = itemRefs[activeIndex]?.current

	/**
	 * Does one of:
	 *		- Replaces the given index in value array w/ new item given
	 *  	- Adds the item (no index specified)
	 *		- Deletes the item (falsey value passed for item)
	 *
	 * Calls parent onChange() with properly-formed Sanity patch
	 */
	const triggerChange = (item, index) => {
		const newValue = [ ...value || [] ]

		// Add or replace according to index
		if (typeof index === `undefined`) newValue.push(item)
		else newValue[index] = item

		// Handles delete via passing falsey value for item
		const finalValue = newValue.filter(Boolean)

		// Create the Sanity patch event using custom function if supplied
		const patch = createPatchEvent
			? createPatchEvent?.(finalValue)
			: PatchEvent.from(set(finalValue))

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


	const handleAddImage = url => {
		const newItem = {
			_key: btoa(Math.random()),
			_type: `customFieldImage`,
			externalUrl: url,
			displayed: true
		}
		triggerChange(newItem)
	}

	const handleClickDelete = deleteIndex => {
		const isConfirmed = confirm(`Are you sure you want to remove this image?`)
		if (isConfirmed) triggerChange(null, deleteIndex)
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

	const handleClickAdd = () => openDialog(`add`)


	// Render each row with the thumbnail, alt text field & "Displayed" switch
	const renderItem = (item, i) => {
		const { externalUrl, altText, displayed } = item

		const itemRef = itemRefs[i]
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
				{allowAddAndRemove && (
					<Button
						kind="simple"
						title="Remove image"
						icon={TrashIcon}
						padding="small"
						onClick={() => handleClickDelete(i)}
					/>
				)}
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
				showAdd={allowAddAndRemove}
				onClickAdd={handleClickAdd}
			/>
			<AddModal
				isActive={activeDialog === `add`}
				onClose={closeDialog}
				onAdd={handleAddImage}
			/>
		</>
	)
})
