import React, { forwardRef } from 'react'
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml'

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
			<h2>HTML Input</h2>
			<CodeMirror
				ref={ref}
				value={value === undefined ? `` : value}
				onBeforeChange={(editor, data, value) => {
					onChange(createPatchFrom(value))
				}}
				onChange={(editor, data, value) => {

				}}
			/>
		</section>
	)
})