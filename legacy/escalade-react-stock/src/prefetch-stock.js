import React from 'react'

import getStore from './stores'

export default class PrefetchStock extends React.Component {
	componentDidMount(){
		getStore(this.props)
	}
	render(){
		return (
			<span></span>
		)
	}
}