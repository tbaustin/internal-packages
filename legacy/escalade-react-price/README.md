# Escalade Sports React Price Component

A react component to display Escalade Sports pricing.

## Installation

With Yarn:

```bash
yarn add escalade-react-price
```

Or npm:

```bash
npm install --save escalade-react-price
```

## Basic Usage

To display price for a single item:

```jsx
import { Price } from 'escalade-react-price'

...

<Price id='AT86A06455R' site='bear' />

{/* Or with render prop */}

<Price id='AT86A06455R' site='bear'>{price => {
	return <div>{price}</div>
}}</Price>

```

## Prefetch Prices

To prefetch prices for all or some products, you can either use the function directly (recommended) or use the component. Just pass in the IDs as well as any other options you would supply for the Price component.

Do this with all IDs on the site to make ensure there's no load times on any price components.

### Function

```jsx
import { prefetchPrices } from 'escalade-react-price'

...

componentWillMount(){
	prefetchPrices({
		site: 'bear',
		ids: [
			'AT86A06455R',
			'AK1450SR',
			'AFT2032140',
		]
	})
}
```

### Component

```jsx
import { PrefetchPrices } from 'escalade-react-price'

...

<PrefetchPrices
	site='bear'
	ids={[
		'AT86A06455R',
		'AK1450SR',
		'AFT2032140',
	]}
	/>
```


## Additional Properties

Property | Description | Type | Default
--- | --- | --- | ---
`id` | The ID to show pricing from (if using Price component) | String | `undefined`
`ids` | A list of IDs to prefetch pricing | Array | `undefined`
`site` | The site ID to pull pricing from | String | `process.env.SITE_ID || process.env.GATSBY_SITE_ID`
`unavailable` | Display property if pricing is unavailable | String or Component | `''`
`loading` | Display property while pricing is loading | String or Component | `''`
`cookies` | Saves fetched pricing to a cookie for quicker loading | Boolean | `true`
`cookieExpiration` | Number of days until cookie expirtes | Number | `1`
`pollInterval` | Length of time in milliseconds until all product pricing is fetched again | Number | `900000` (15 minutes)
`endpoint` | A URL or stage to fetch prices from | String | `process.env.PRICING_ENDPOINT || process.env.GATSBY_PRICING_ENDPOINT || 'production'`