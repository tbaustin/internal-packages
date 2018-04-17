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
        <PrefetchPriceAndStock
          site="goalrilla"
          ids={[
            'b1002',
            'b1030',
            'b2415w',
            'b2600',
            'b2601',
            'b2607w',
            'b2611w',
            'b2618',
            'b2700w',
            'b2800w-2',
            'b3010w',
            'b3011w',
            'b3015w',
            'b3016w',
            'b3017w',
            'b3100w',
            'b3101w',
            'b3200w',
            'b3222w',
            'b3300w',
            'b3333w',
            'b5000w',
            'b5002w',
            'b5003w',
            'b6101w',
            'b8300w',
            'b8301w',
            'b9000w',
            'dc-pole-pad',
            'ncaa-backboard-pad',
            'pc824-ark',
            'pc824-but',
            'pc824-byu',
            'pc824-cin',
            'pc824-cru1',
            'pc824-cu1',
            'pc824-day3',
            'pc824-duke',
            'pc824-eil',
            'pc824-ia',
            'pc824-ind',
            'pc824-isu',
            'pc824-ku',
            'pc824-ky',
            'pc824-lou',
            'pc824-lsu',
            'pc824-mar2',
            'pc824-min',
            'pc824-mis',
            'pc824-mts',
            'pc824-nds',
            'pc824-ndu',
            'pc824-neb1',
            'pc824-nw',
            'pc824-ohs1',
            'pc824-oks',
            'pc824-oku',
            'pc824-pit',
            'pc824-psu',
            'pc824-pur1',
            'pc824-syr',
            'pc824-tcu',
            'pc824-tn',
            'pc824-tt',
            'pc824-tul',
            'pc824-ucn',
            'pc824-umd',
            'pc824-unc2',
            'pc824-uni',
            'pc824-utah',
            'pc824-wis',
            'pc824-wv',
            'pc824-xav',
            'pc824clem1',
            'pc824ia-ne',
            'pc824iais1',
            'pc824mizz1',
            'pc824wist1',
            'tr0001w',
            'tr0002w',
            'tr0003w',
            'tr2000w',
            'tr2001w',
            'tr5000w'
          ]}
        />
      </div>
    );
  }
}

render(<Test />, containerEl);
