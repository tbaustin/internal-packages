# react-escalade-priceline

Dynamically fetch or prefetch Escalade stock & pricing.

## Installation

With npm:

```bash
npm install --save react-escalade-priceline
```

With Yarn:

```bash
yarn add react-escalade-priceline
```

## Usage

### Fetching price and/or stock

```jsx
import { Price, Stock, PriceAndStock } from 'react-escalade-priceline'

...

<Price site='goalrilla' id='b6101w'>
	{({ price, loading }) => {
		return (
			<div>
				{loading && 'Loading...'}
				{!loading && price && `$${price.toFixed(2)}`}
			</div>
		)
	}}
</Price>

...

<Stock site='goalrilla' id='b6101w'>
	{({ stock, loading }) => {
		return (
			<div>
				{loading && 'Loading...'}
				{!loading && stock && 'In stock'}
				{!loading && !stock && 'Out of stock'}
			</div>
		)
	}}
</Stock>

...

<PriceAndStock site='goalrilla' id='b6101w'>
	{({ stock, price, loading }) => {
		if(loading) return <div>Loading...</div>
		return (
			<div>
				<div>Price: {price}</div>
				<div>Stock: {stock}</div>
			</div>
		)
	}}
</PriceAndStock>
```

### Prefetching price and/or stock

```jsx
import { PrefetchPrice, PrefetchStock, PrefetchPriceAndStock } from 'react-escalade-priceline'

...

<PrefetchPrice site='goalrilla' id={['b6101w', 'b3101w' ]} />

...

<PrefetchStock site='goalrilla' id={['b6101w', 'b3101w' ]} />

...

<PrefetchPriceAndStock site='goalrilla' id={['b6101w', 'b3101w' ]} />
```

### Switch to testing environment

```jsx
import { PriceAndStock } from 'react-escalade-priceline'

<PriceAndStock site='goalrilla' id='b6101w' env="testing">
	{({ stock, price, loading }) => {
		if(loading) return <div>Loading...</div>
		return (
			<div>
				<div>Price: {price}</div>
				<div>Stock: {stock}</div>
			</div>
		)
	}}
</PriceAndStock>
```
