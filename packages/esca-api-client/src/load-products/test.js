import EscaAPIClient from '../index'


const client = new EscaAPIClient({
  environment: `prod`,
  site: `lifeline`,
  apiKey: `bogus`
})


test(`Loads Lifeline products`, async () => {
  expect.assertions(2)

  const products = await client.loadProducts({
    fields: [`inventory`, `price`],
    skus: [`2-FMT-3`, `2-FMT-5`]
  })

  expect(products).toBeInstanceOf(Array)
  expect(products).toHaveLength(2)
})
