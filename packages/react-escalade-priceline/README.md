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

```jsx
import Availability from 'react-escalade-priceline'

...

<Availability site='goalrilla' id='b6101w'>
	{({ stock, pricing }) => {
		if (pricing && stock) {
			return (
				<div>
					<div>Pricing: {pricing}</div>
					<div>Stock: {stock}</div>
				</div>
			)
		}
		return <div>Loading...</div>
	}}
</Availability>
```