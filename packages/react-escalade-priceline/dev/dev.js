import React from 'react'
import { render } from 'react-dom'
import Availability from '../src'

const containerEl = document.createElement('div')
document.body.appendChild(containerEl)

render(
	<div>
		<Availability site='goalrilla' id='b6101w'>
			{({ stock, pricing, loading }) => {
				if(loading){
					return <div>Loading...</div>
				}
				if(!stock){
					return <div>Out of Stock</div>
				}
				return (
					<div>
						<div>Pricing: {pricing}</div>
						<div>Stock: {stock}</div>
					</div>
				)
			}}
		</Availability>
	</div>,
	containerEl
)