import React, { Component } from 'react'
import { Subscribe } from 'statable'
import pricingState from './pricing-state'

class Price extends Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.fetch = this.fetch.bind(this)
	}
	componentDidMount() {
		this.fetch()
	}
	componentDidUpdate() {
		this.fetch()
	}
	fetch() {
		let options = {
			...this.props
		}
		if (!options.endpoint) {
			options.endpoint = this.props.endpoints[options.env]
		}
		pricingState.fetch(options)
	}
	render() {
		if (!this.props.children || (!this.props.id && !this.props.ids)) {
			return null
		}
		const { id } = this.props
		return (
			<Subscribe to={pricingState}>
				{price => {
					if (this.props.children) {
						let obj
						if (id) {
							obj = {
								price: price[id.toLowerCase()],
								loading: !(id.toLowerCase() in price)
							}
						} else {
							obj = {
								price,
								loading: !price
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
		production: `https://pricing.escsportsapi.com/load`,
		testing: `https://pricing-test.escsportsapi.com/load`,
	},
}


export default Price
