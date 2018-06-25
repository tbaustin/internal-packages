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
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.length !== this.props.length) {
      this.fetch()
    }
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
    if (!this.props.children || (!this.props.id && !this.props.ids)) return null
    const { id } = this.props
    return (
      <Subscribe to={pricingState}>
        {price => {
          if (this.props.children) {
            let obj
            if (id && price.prices) {
              obj = {
                price: price.prices[id.toUpperCase()].price,
                loading: !(id.toUpperCase() in price.prices)
              }
            } else {
              obj = {
                price: price.prices,
                loading: !price.prices
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
    testing: `https://pricing-test.escsportsapi.com/load`
  }
}


export default Price
