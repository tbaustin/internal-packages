import React, { Component } from 'react'
import { Subscribe } from 'statable'

import stockState from './stock-state'

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
	}
	render(){
		return (
			<Subscribe to={stockState}>
				{state => {
					if (this.props.children) {
						let id
						if(this.props.id){
							id = state[this.props.id]
						}
						else{
							id = state
						}
						return this.props.children(id)
					}
				}}
			</Subscribe>
		)
	}
}

export default Availability