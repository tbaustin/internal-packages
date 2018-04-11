import React, { Component } from 'react';
import { Subscribe } from 'statable';

import { Stock, Price } from './';

<<<<<<< HEAD
class PriceAndStock extends Component {
  render() {
    return (
      <Stock {...this.props}>
        {({ stock, loading }) => {
          let stockLoading = loading;
          return (
            <Price {...this.props}>
              {({ price, loading }) => {
                if (!this.props.children) return null;
                let priceLoading = loading;
                return this.props.children({
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
=======
class PriceAndStock extends Component{
	render() {
		const renderChild = this.props.children
		return (
			<Stock {...this.props}>
				{({ stock, loading }) => {
					let stockLoading = loading
					return (
						<Price {...this.props}>
							{({ price, loading }) => {
								if (!renderChild){
									return null
								}
								let priceLoading = loading
								return renderChild({
									stock,
									stockLoading,
									price,
									priceLoading,
									loading: stockLoading || priceLoading,
								})
							}}
						</Price>
					)
				}}
			</Stock>
		)
	}
>>>>>>> 161155565ef49ec63110a2c7789ec9e6428cdf8c
}

export default PriceAndStock;
