import { getComponentName } from './index'


const testComp1 = { displayName: `TestComponent1` }
const testComp2 = { name: `TestComponent2` }
const testComp3 = {}
const testComp4 = () => null
const testComp5 = null

const description = `Gets the display name of a React component`

test(description, () => {
  expect(getComponentName(testComp1)).toBe(`TestComponent1`)
  expect(getComponentName(testComp2)).toBe(`TestComponent2`)
  expect(getComponentName(testComp3)).toBe(`Component`)
  expect(getComponentName(testComp4)).toBe(`testComp4`)
  expect(getComponentName(testComp5)).toBe(`Component`)
})
