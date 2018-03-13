import React, { Component } from 'react'
import { Subscribe } from 'statable'

import stockState from './stock-state'
import pricingState from './pricing-state'

class Availability extends Component{
	constructor(props){
		super(props)
		this.state = {}
	}
	componentDidMount(){
		stockState.fetch({
			site: this.props.site,
			ids: this.props.id || this.props.ids,
		})
		pricingState.fetch({
			site: this.props.site,
			ids: this.props.id || this.props.ids,
		})
	}
	render(){
		return (
			<Subscribe to={[stockState, pricingState]}>
				{(stock, pricing) => {
					if (this.props.children) {
						let obj
						if (this.props.id) {
							obj = {
								stock: stock[this.props.id],
								pricing: pricing[this.props.id]
							}
						}
						else{
							obj = {
								stock,
								pricing
							}
						}
						return this.props.children(obj)
					}
				}}
			</Subscribe>
		)
	}
}

export default Availability