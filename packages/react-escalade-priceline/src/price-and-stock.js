import React, { Component } from 'react'
import { Subscribe } from 'statable'

import {
	Stock,
	Price,
} from './'

class PriceAndStock extends Component{
	render() {
		if (!this.props.children) return null
		return (
			<Stock {...this.props}>
				{({ stock, loading }) => {
					let stockLoading = loading
					return (
						<Price {...this.props}>
							{({ price, loading }) => {
								let priceLoading = loading
								return this.props.children({
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