# react-esca-api

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

const CustomHook = () => {
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

const CustomComp = () => (
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

export default function Test() {
  const useComp = true;
  return (
    <ProductsProvider>
      {useComp ? <CustomComp /> : <CustomHook />}
    </ProductsProvider>
  );
}
```
