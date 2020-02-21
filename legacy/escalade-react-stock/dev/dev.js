import React from 'react'
import { render } from 'react-dom'
import { Available, prefetchStock } from '../src'

let containerEl = document.createElement('div')
document.body.appendChild(containerEl)

prefetchStock('goalrilla', ['asdf'])

render(
	<Available
		site='bear'
		id='AT86A06455R'
		unavailable='Out of Stock'
		loading='Loading...'
		cookies={false}
		verbose
	>
		<button>Add to Cart</button>
	</Available>,
	containerEl
)