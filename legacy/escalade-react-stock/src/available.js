import React from 'react'

import getStore from './stores'

class Available extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			display: props.loading
		}
		this.setStock = this.setStock.bind(this)
	}
	componentDidMount(){
		this.store = getStore(this.props)

		// Change component by event
		this.store.addEvent(this.setStock, {
			id: this.props.id
		})

		// Change component if price is already set
		let stock = this.store.getStock(this.props.id)
		if (stock !== undefined){
			this.setStock(stock)
		}
		else{
			this.setStock(false)
		}
	}
	setStock(stock) {
		if (!stock) {
			return this.setState({ display: this.props.unavailable })
		}
		return this.setState({ display: this.props.children })
	}
	render(){
		return (
			<div>{ this.state.display }</div>
		)
	}
}

Available.defaultProps = {
	loading: '',
	unavailable: 'Out of Stock',
}

export default Available