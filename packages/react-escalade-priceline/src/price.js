import React, { Component } from 'react'
import { Subscribe } from 'statable'

import pricingState from './pricing-state'

class Price extends Component{
	constructor(props){
		super(props)
		this.state = {}
	}
	componentDidMount(){
		let options = {
			...this.props
		}
		if (!options.endpoint) {
			options.endpoint = this.props.endpoints[options.env]
		}
		pricingState.fetch(options)
	}
	render(){
		if(!this.props.children) return null
		return (
			<Subscribe to={pricingState}>
				{price => {
					if (this.props.children) {
						let obj
						if (this.props.id) {
							obj = {
								price: price[this.props.id],
								loading: !(this.props.id in price),
							}
						}
						else{
							obj = {
								price,
								loading: !price,
							}
						}
						return this.props.children(obj)
					}
				}}
			</Subscribe>
		)
	}
}

Price.defaultProps = {
	env: `production`,
	endpoints: {
		production: `https://cojn6cbcd7.execute-api.us-east-1.amazonaws.com/production/handler`,
		testing: `https://hmfnvefe14.execute-api.us-east-1.amazonaws.com/staging/handler`,
	}
}

export default Price