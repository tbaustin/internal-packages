import React, { Component } from 'react';
import { Subscribe } from 'statable';

import pricingState from './pricing-state';

class Price extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fetch = this.fetch.bind(this);
  }
  componentDidMount() {
    this.fetch();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.length !== this.props.length) {
      this.fetch();
    }
  }
  fetch() {
    let options = {
      ...this.props
    };
    if (!options.endpoint) {
      options.endpoint = this.props.endpoints[options.env];
    }
    pricingState.fetch(options);
  }
  render() {
    if (!this.props.children || (!this.props.id && !this.props.ids))
      return null;
    const { id } = this.props;
    const updatedId = id.toLowerCase();
    return (
      <Subscribe to={pricingState}>
        {price => {
          if (this.props.children) {
            let obj;
            if (this.props.id) {
              obj = {
                price: price[updatedId],
                loading: !(updatedId in price)
              };
            } else {
              obj = {
                price,
                loading: !price
              };
            }
            return this.props.children(obj);
          }
        }}
      </Subscribe>
    );
  }
}

Price.defaultProps = {
  env: `production`,
  endpoints: {
    production: `https://cojn6cbcd7.execute-api.us-east-1.amazonaws.com/production/handler`,
    testing: `https://hmfnvefe14.execute-api.us-east-1.amazonaws.com/staging/handler`
  }
};

export default Price;
