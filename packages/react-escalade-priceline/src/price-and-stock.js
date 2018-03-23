import React, { Component } from 'react'
import { Subscribe } from 'statable'

import {
	Stock,
	Price,
} from './'

class PriceAndStock extends Component{
	render() {
		const renderChild = this.props.children
		return (
			<Stock {...this.props}>
				{({ stock, loading }) => {
					console.log('Stock rendering...')
					let stockLoading = loading
					return (
						<Price {...this.props}>
							{({ price, loading }) => {
								console.log('Price rendering...')
								if (!renderChild){
									console.log('Rendering null')
									console.log(renderChild)
									return null
								}
								console.log('Rendering price and stock')
								let priceLoading = loading
								return renderChild({
									stock,
									stockLoading,
									price,
									priceLoading,
									loading: stockLoading || priceLoading,
								})
							}}
						</Price>
					)
				}}
			</Stock>
		)
	}
}

export default PriceAndStock