import React, { Component } from 'react';
import { Subscribe } from 'statable';

import { Stock, Price } from './';

class PriceAndStock extends Component {
  render() {
    const renderChild = this.props.children;
    return (
      <Stock {...this.props}>
        {({ stock, loading }) => {
          let stockLoading = loading;
          return (
            <Price {...this.props}>
              {({ price, loading }) => {
                if (!renderChild) {
                  return null;
                }
                let priceLoading = loading;
                return renderChild({
                  stock,
                  stockLoading,
                  price,
                  priceLoading,
                  loading: stockLoading || priceLoading
                });
              }}
            </Price>
          );
        }}
      </Stock>
    );
  }
}

export default PriceAndStock;
