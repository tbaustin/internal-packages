# esca-api-client
A JavaScript client library for Escalade Sports microservices

# Usage

### Step 1 – Instantiate the client
```javascript
/**
 * Note: the below import should work as written; if not, you may need
 * to import from either '@escaladesports/esca-api-client/browser' or
 * '@escaladesports/esca-api-client/node' depending on your environment
 */
import EscaAPIClient from '@escaladesports/esca-api-client'

const client = new EscaAPIClient({
  environment: `prod`,              // 'test' or 'prod'; defaults to 'test'
  site: `lifeline`,                 // site name; same as ESC-API-Context header
  apiKey: `123abc789xyz`,           // optional; uses relative URLs if not given
  devHost: `http://localhost:8000`  // optional; specifies exact host/port in dev
})
```
**Important notes on API URLs:**  
- If `apiKey` is not provided, relative URLs formatted like `/api/{resource}/{action}` will be used (e.g. `/api/products/load`). Otherwise, the full `escsportsapi.com` URLs will be used (e.g. `https://products.escsportsapi.com/load`) unless `devHost` is set.
- If `devHost` is provided, URLs will **permanently** be the value of `devHost` followed by the relative URL structure described above. This config property should be conditionally included if using the client in a development context and left out completely for production.

### Step 2 – Use the client
Here's an example using the `loadProducts` method:
```javascript
const products = await client.loadProducts({
  fields: [`inventory`, `price`], // optional; returns name & sku by default
  skus: [`2-FMT-3`, `2-FMT-5`],   // optional; defaults to 'all'
  byParent: true  // optional; groups variants by base product
  // These alternatives are also accepted:
  //    groupByParent: true
  //    groupby: `parent`
  //    groupBy: `parent`
})
```

# Methods
TODO: document these

| Method              | Description |
| ---                 | ---         |
| `loadProducts`      |             |
| `shippingQuote`     |             |
| `calculateTaxes`    |             |
| `loadCoupon`        |             |
| `calculateDiscount` |             |
| `validateCoupon`    |             |
| `getOrderId`        |             |
| `loadOrder`         |             |
| `storeOrder`        |             |


# Error Handling & Reporting

The client is meant to handle & report most errors. All functions will either:

A) return the expected data or appropriate empty structure (e.g. empty array for products)

B) potentially throw an error (for create/update/delete actions); the error will always be a proper `Error` object with a message suitable for displaying to the user

 Functions which only load data (e.g. `loadProducts`) will never throw errors but may log failed requests or other problems to the console. Any problems such as failed API calls (non-404) will be reported to Sentry.

# Development Notes
This package uses Jest for testing. Run `yarn test` to run all tests throughout the package.

The test files use these environment variables to make requests to the services, so make sure they are set:

| Variable        | Description                                               |
| ---             | ---                                                       |
| `TEST_API_ENV`  | Environment for the API to use (`dev`, `test`, or `prod`) |
| `TEST_API_KEY`  | API key to use for the services                           |

Within the test files, these variables can be accessed simply as `TEST_API_ENV` and `TEST_API_KEY` (without `process.env` prepended). They are set up as Jest globals in `jest.config.js` via the `dotenv` package.
