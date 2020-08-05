/** @jsx jsx */
import React, { forwardRef, useState, useMemo } from 'react'
import { jsx } from '@emotion/core'
import Patch, { set } from 'part:@sanity/form-builder/patch-event'
import Fieldset from 'part:@sanity/components/fieldsets/default'
import { List, Item, DragHandle } from 'part:@sanity/components/lists/sortable'
import { combineArrays } from '@escaladesports/utils'
import useDocuments from './use-documents'
import * as styles from './styles'



export default forwardRef((props, ref) => {
	const { options, type, value, onChange, createPatchEvent } = props
	const { documents: documentsProp } = props

	const [isMoving, setMoving] = useState(false)
	/**
	 * The full resolved documents for references in the value array
	 * Either use the custom hook directly or take a prop for documents from any
	 * any wrapper input component that may be using the hook itself
	 */
	const documents = documentsProp || useDocuments(value)

	// Accept a custom render function to render each row
	const renderItem = props.renderItem || type?.options?.renderItem


	const fullItems = useMemo(() => {
		if (!documents?.length) return value
		const valueWithIds = value.map(v => ({ ...v, _id: v._ref }))
		return combineArrays(`_id`, valueWithIds, documents)
	}, [documents, value])


	const handleSortStart = () => setMoving(true)


	const handleSortEnd = ({ newIndex, oldIndex }) => {
		setMoving(false)
		const item = value[oldIndex]
		const refItem = value[newIndex]

		const keyMissing = !item._key || !refItem._key
		const samePosition = oldIndex === newIndex || item._key === refItem._key

		keyMissing && console.error(
			`Key missing for moving item or destination item. Cannot continue.`
		)

		const newValue = [ ...value ]
		newValue.splice(oldIndex, 1)
		newValue.splice(newIndex, 0, item)

		const patchEvent = createPatchEvent
			? createPatchEvent?.(newValue)
			: Patch.from(set(newValue))

		!keyMissing && !samePosition && onChange?.(patchEvent)
	}


	return (
		<Fieldset legend={type?.title} description={type?.description} ref={ref}>
			<List
				onSortEnd={handleSortEnd}
				onSortStart={handleSortStart}
				lockToContainerEdges
				useDragHandle
			>
				{fullItems?.map?.((item, i, allItems) => {
					const { _type, _ref, name, title } = item
					const customRender = renderItem?.(item, i, allItems)

					return (
						<Item key={i} index={i} css={styles.item}>
							<DragHandle css={styles.icon} />
							{customRender || title || name || _ref || _type}
						</Item>
					)
				})}
			</List>
		</Fieldset>
	)
})
