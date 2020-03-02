# Escalade Sports React Stock Component

A react component to display Escalade Sports stock.

## Installation

With Yarn:

```bash
yarn add escalade-react-stock
```

Or npm:

```bash
npm install --save escalade-react-stock
```

## Basic Usage

To only display content if a product is in stock:

```jsx
import { Available } from 'escalade-react-stock'

...

<Available id='AT86A06455R' site='bear'>
	<button>Add to Cart</button>
</Available>
```

## Prefetch Stock

To prefetch stock for all or some products, you can either use the function directly (recommended) or use the component. Just pass in the IDs as well as any other options you would supply for the Available component.

Do this with all IDs on the site to make ensure there's no load times on any `<Available>` components.

### Function

```jsx
import { prefetchStock } from 'escalade-react-stock'

...

componentWillMount(){
	prefetchStock({
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
import { PrefetchStock } from 'escalade-react-stock'

...

<PrefetchStock
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
`unavailable` | Display property if stock is unavailable | String or Component | `'Out of Stock'`
`loading` | Display property while stock is loading | String or Component | `''`
`cookies` | Saves fetched pricing to a cookie for quicker loading | Boolean | `true`
`cookieExpiration` | Number of days until cookie expirtes | Number | `1`
`pollInterval` | Length of time in milliseconds until all product pricing is fetched again | Number | `900000` (15 minutes)
`endpoint` | A URL or stage to fetch prices from | String | `process.env.STOCK_ENDPOINT || process.env.GATSBY_STOCK_ENDPOINT || 'production'`