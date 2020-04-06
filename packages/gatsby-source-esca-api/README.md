# @escaladesports/gatsby-source-esca-api

Used to get product information for escalade sports into gatsby.

## Implementation

Inside of `gatsby-config.js`

```js
{
 resolve: `@escaladesports/gatsby-source-esca-api`,
 options: {
  site: `lifeline`, // site-id you are using
  env: `prod`, // environment you wish to retrieve products from
  fields: [`inventory`, `price`], // base fields you wish to query
  salsify: [`Web Images`], // any other salsify fields --> NO SUPPORT FOR GATSBY IMAGE THOUGH
  apiKey: X_API_KEY, // X-API-KEY needed to pass to esca api's
 },
},
```

This returns two types: `EscaladeProducts` and `allEscaladeProducts`
