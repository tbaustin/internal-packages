import React from 'react'
import loadable from '@loadable/component'

const AsyncWidget = loadable(props => import(`./${props.type}`), {
	fallback: <div>Loading...</div>
})

export default function FilterWidget(props) {
	const { filter } = props
	const combinedProps = {...filter, ...props}
	return (
		<AsyncWidget
			{...combinedProps}
			type={filter.filterWidget}
		/>
	)
}