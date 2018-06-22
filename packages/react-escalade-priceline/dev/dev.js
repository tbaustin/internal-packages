import React, { Component } from 'react'
import { render } from 'react-dom'
import { Price, PriceAndStock, PrefetchPriceAndStock } from '../dist'
const containerEl = document.createElement('div')
document.body.appendChild(containerEl)

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: 'b6101w'
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        id: 'b8301w'
      })
    }, 2 * 1000)
  }
  render() {
    const ids = ['b1002', 'b1030', 'b2415w']
    return (
      <div>
        <PriceAndStock site="goalrilla" id="b1002">
          {({ stock, price, loading }) => {
            // console.log(stock, price, loading)
            if (loading) return <div>loading</div>
            return (
              <div>
                <div>Price: {price}</div>
                <div>Stock: {stock}</div>
              </div>
            )
          }}
        </PriceAndStock>
      </div>
    )
  }
}

render(<Test />, containerEl)
