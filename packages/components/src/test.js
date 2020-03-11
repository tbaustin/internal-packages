import { sum, sumDelayed } from './index'


test(`Adds numbers together`, async () => {
  expect(sum(1, 2, 3)).toBe(6)
  expect(sum(5, 5, 5, 6)).toBe(21)
  expect(await sumDelayed(70, 30)).toBe(100)
})
