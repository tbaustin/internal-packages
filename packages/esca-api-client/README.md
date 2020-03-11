# esca-api-client
A JavaScript client library for Escalade Sports microservices

## Usage

1) Instantiate the client:
```javascript
/**
 * Note: the below import should work as written; if not, you may need
 * to import from either '@escaladesports/esca-api-client/browser' or
 * '@escaladesports/esca-api-client/node' depending on your environment
 */ 
import EscaAPIClient from '@escaladesports/esca-api-client'

const client = new EscaAPIClient({
  environment: `prod`,    // 'test' or 'prod'; defaults to 'test'
  site: `lifeline`,       // site name; same as ESC-API-Context header
  apiKey: `123abc789xyz`  // optional; uses relative URLs if not given
})
```

Note: if `apiKey` is not provided, relative URLs formatted like `/api/{resource}/{action}` will be used (e.g. `/api/products/load`). Otherwise, the full `escsportsapi.com` URLs will be used (e.g. `https://products.escsportsapi.com/load`).

2) Use the client. Currently, `loadProducts` is the only available function:
```javascript
const products = await client.loadProducts({
  fields: [`inventory`, `price`], // optional; returns name & sku by default
  skus: [`2-FMT-3`, `2-FMT-5`]    // optional; defaults to 'all'
})
```

## Error Handling & Reporting

The client is meant to handle & report most errors. All functions will either:

A) return the expected data or appropriate empty structure (e.g. empty array for products)

B) potentially throw an error (for create/update/delete actions); the error will always be a proper `Error` object with a message suitable for displaying to the user

 Functions which only load data (e.g. `loadProducts`) will never throw errors but may log failed requests or other problems to the console. Any problems such as failed API calls (non-404) will be reported to Sentry.
