import React, { forwardRef } from 'react'
import { SketchPicker } from 'react-color'

import PatchEvent, {set, unset} from 'part:@sanity/form-builder/patch-event'

const createPatchFrom = value => PatchEvent.from(
	value === ``
		? unset()
		: set(value),
)

export default forwardRef((props, ref) => {
	const { value, onChange } = props

	return (
		<section>
			<h2>Color Input</h2>
			<SketchPicker ref={ref} />
		</section>
	)
})
