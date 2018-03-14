import React from 'react'
import { render } from 'react-dom'
import { Stock, Price, PriceAndStock } from '../src'

const containerEl = document.createElement('div')
document.body.appendChild(containerEl)

render(
	<div>
		<PriceAndStock site='goalrilla' id='b6101w'>
			{({ stock, price, loading }) => {
				if(loading){
					return <div>Loading...</div>
				}
				return <div>
					<div>Stock: {stock}</div>
					<div>Price: {price}</div>
				</div>
			}}
		</PriceAndStock>
	</div>,
	containerEl
)