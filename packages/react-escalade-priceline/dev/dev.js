import React from 'react'
import { render } from 'react-dom'
import Src, { Availability } from '../src'

const containerEl = document.createElement('div')
document.body.appendChild(containerEl)

render(
	<div>
		<Availability site='goalrilla' id='b6101w'>
			{stock => {
				return <div>{stock}</div>
			}}
		</Availability>
	</div>,
	containerEl
)