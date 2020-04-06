# react-esca-api
React components & hooks for using Escalade Sports API data

## Example Code

```js
import React from 'react';
import {
  ProductsProvider,
  useProducts,
  Products,
} from '@escaladesports/react-esca-api';

const options = {
  site: 'lifeline',
  env: 'prod',
  fields: ['inventory', 'price'],
  salsify: ['Web Images'],
};

const CustomComponentWithHook = () => {
  const [products] = useProducts(options);
  return (
    <section>
      {!products
        ? <div>Loading...</div>
        : products.map(product => (
          <div key={product.sku}>
          <hr />
          <span>
            {product.sku} - {product.name}
          </span>
          <br />
          <span>
            {product.price} - {product.stock}
          </span>
          <hr />
        </div>
        ))}
    </section>
  );
};

// Note: <Products> renders a basic default display if no children specified
const CustomComponentPlain = () => (
  <Products options={options}>
    {({ products, loading }) => (loading
      ? <div>Loading...</div>
      : products.map(product => (
        <div key={product.sku}>
          <hr />
          <span>
            {product.sku} - {product.name}
          </span>
          <br />
          <span>
            {product.price} - {product.stock}
          </span>
          <hr />
        </div>
      )))}
  </Products>
);

export default function Test(props) {
  const { useComp } = props

  return (
    <ProductsProvider>
      {useComp ? <CustomComponentPlain /> : <CustomComponentWithHook />}
    </ProductsProvider>
  );
}
```
