import React, { Component } from 'react';
import { render } from 'react-dom';
import { Price, PriceAndStock, PrefetchPriceAndStock } from '../src';
const containerEl = document.createElement('div');
document.body.appendChild(containerEl);

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 'b6101w'
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        id: 'b8301w'
      });
    }, 2 * 1000);
  }
  render() {
    return (
      <div>
        <PriceAndStock site="stiga" env="testing" id="T8591B">
          {({ stock, price, loading }) => {
            if (loading) {
              return <div>Loading...</div>;
            }
            return (
              <div>
                <div>Stock: {stock}</div>
                <div>Price: {price}</div>
              </div>
            );
          }}
        </PriceAndStock>
        {/* <PrefetchPriceAndStock site="goalrilla" ids={['b8301w', 'b8301w']} /> */}
      </div>
    );
  }
}

render(<Test />, containerEl);
