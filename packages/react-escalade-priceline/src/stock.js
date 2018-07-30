import React, { Component } from 'react'
import { Subscribe } from 'statable'
import stockState from './stock-state'

class Stock extends Component {
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
		stockState.fetch(options)
	}
	render() {
		if (!this.props.children || (!this.props.id && !this.props.ids)) {
			return null
		}
		const { id } = this.props
		return (
			<Subscribe to={stockState}>
				{stock => {
					if (this.props.children) {
						let obj
						if (id) {
							const lowerId = id.toLowerCase()
							obj = {
								stock: stock[lowerId],
								loading: !(lowerId in stock)
							}
						} else {
							obj = {
								stock,
								loading: !stock
							}
						}
						return this.props.children(obj)
					}
				}}
			</Subscribe>
		)
	}
}

Stock.defaultProps = {
	env: `production`,
	endpoints: {
		production: `https://inventory.escsportsapi.com/load`,
		testing: `https://inventory-test.escsportsapi.com/load`,
	},
}

export default Stock