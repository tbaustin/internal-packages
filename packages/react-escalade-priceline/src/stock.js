import React, { Component } from 'react'
import { Subscribe } from 'statable'

import stockState from './stock-state'

class Stock extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	componentDidMount() {
		let options = {
			...this.props
		}
		if (!options.endpoint) {
			options.endpoint = this.props.endpoints[options.env]
		}
		stockState.fetch(options)
	}
	render() {
		if (!this.props.children) return null
		return (
			<Subscribe to={stockState}>
				{stock => {
					if (this.props.children) {
						let obj
						if (this.props.id) {
							obj = {
								stock: stock[this.props.id],
								loading: !(this.props.id in stock),
							}
						}
						else {
							obj = {
								stock,
								loading: !stock,
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
		production: `https://xinn7f22bj.execute-api.us-east-1.amazonaws.com/production/handler`,
		testing: `https://t9w63tqdfk.execute-api.us-east-1.amazonaws.com/staging/handler`,
	}
}

export default Stock