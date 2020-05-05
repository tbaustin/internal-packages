# @escaladesports/utils
Utility functions for use in websites & other projects

Included functions:
- [graphToArray](#graphtoarray)
- [getComponentName](#getcomponentname)
- [trimCommon](#trimcommon)
- [Currency Functions](#currency-functions):
  - [formatPrice](#formatprice)
  - [unformatPrice](#unformatprice)
  - [toCents](#tocents)
  - [toDollars](#todollars)

---

# `graphToArray`
Makes a plain array out of the graph structure commonly returned by GraphQL APIs. Accepts an object with either an `edges` or `nodes` array.

### Example usage:
```javascript
const mockData = {
  edges: [
    {
      node: {
        someProperty: `Marco`
      }
    },
    {
      node: {
        someProperty: `Polo`
      }
    }
  ]
}

graphToArray(mockData)
// [
//   { someProperty: `Marco` },
//   { someProperty: `Polo` }
// ]
```

You can also pass a 2nd argument specifying a path for returning a nested
property in each node that is an object (uses [`get()` from Lodash](https://lodash.com/docs/4.17.15#get) internally).

```javascript
graphToArray(mockData, `someProperty`)
// [`Marco`, `Polo`]
```

Alternatively, you can pass an object containing `nodes` directly instead of `edges`. Some GraphQL APIs are able to return data this way.

```javascript
const mockData2 = {
  nodes: [
    { someProperty: `Marco` },
    { someProperty: `Polo` }
  ]
}

graphToArray(mockData2, `someProperty`)
// [`Marco`, `Polo`]
```

**NOTE:** This function assumes only one connection in the graph structure, so the conversion is only applied to the `edges` array at the top/root level of the data. It does not handle multiple or nested connections – so it's mostly useful when the data being worked with doesn't fit a graph structure in the first place but gets returned that way from an API (e.g. most Escalade CMS data).

See [this blog post](https://blog.apollographql.com/explaining-graphql-connections-c48b7c3d6976) for more info on graph data structures.

---

# `getComponentName`
Returns the display name of a React component. Useful for making a higher-order component display a developer-friendly tag name in the React dev tools Components tab.

### Example usage:
```javascript
function MyComponent(props) {
  return <h1>{props.title}</h1>
}

getComponentName(MyComponent)
// `MyComponent`


```
### Example usage in HOC:
```javascript
function withEnhancement(OrigComponent) {
  function EnhancedComponent(props) {
    console.log(`I'm enhanced now!!!`)
    return <OrigComponent {...props} />
  }

  const origName = getComponentName(OrigComponent)
  EnhancedComponent.displayName = `withEnhancement(${origName})`

  return EnhancedComponent
}
```

---

# `trimCommon`

Removes all beginning characters that are shared in common by every string in a given list. The list can be an array of either strings or objects containing strings.

When passing an array of objects, the 2nd argument is the property or path (as a string) to follow in each object to get to the intended string value. The objects will be preserved in the output with the inner targeted property values changed; **this mutates the original object**.

### Example Usage

With strings:
```javascript
const strings = [
  `Virtuous Contract`,
  `Virtuous Treaty`,
  `Virtuous Dignity`,
  `Virtuous Grief`,
]

trimCommon(strings)
// [`Contract`, `Treaty`, `Dignity`, `Grief`]
```

With objects:
```javascript
const objects = [
  { strings: [`Cruel Oath`] },
  { strings: [`Cruel Blood Oath`] },
  { strings: [`Cruel Arrogance`] },
  { strings: [`Cruel Lament`] },
]

trimCommon(objects, `strings[0]`)
// [
// 	{ strings: [`Oath`] },
// 	{ strings: [`Blood Oath`] },
// 	{ strings: [`Arrogance`] },
// 	{ strings: [`Lament`] },
// ]
```

---

# Currency Functions

These functions are meant to be as flexible and predictable as possible – so despite the thorough documentation of their behavior below, you can usually  safely assume that they will work with whatever value you're passing and output what you would expect.

**Just keep in mind that `toDollars` always assumes you're passing a value in cents – even if you pass it a value containing a dollar sign! ([see below](#todollars))**

## `formatPrice`

Formats a number as US currency.

Takes either a number or numeric string as input and can handle different input formats to a reasonable degree. An empty string is returned if the input is falsey or not number-like at all.

Examples:
```javascript
formatPrice(2)            // `$2.00`
formatPrice(12.345)       // `$12.35`
formatPrice(1000000)      // `$1,000,000.00`
formatPrice(0)            // `$0.00`
formatPrice(`3.501`)      // `$3.50`
formatPrice(`$9,000.01`)  // `$9,000.01`
formatPrice(`-9,000.01`)  // `-$9,000.01`
formatPrice(`123abc`)     // `$123.00`
formatPrice(`godzilla`)   // ``
formatPrice(``)           // ``
formatPrice(false)        // ``
formatPrice(null)         // ``
formatPrice(undefined)    // ``
```

## `unformatPrice`

Converts US currency format to a plain number.

Takes either a string or number as input and can handle different input formats to a reasonable degree. For example: the function can take a value that is already a plain number type and simply output the same value.

Always returns a number (for valid number-like input) or `null` (for invalid/non-zero falsey input).

Examples:
```javascript
unformatPrice(`$3.50`)          // 3.5
unformatPrice(`$1,000,000.00`)  // 1000000
unformatPrice(`-$100.00`)       // -100
unformatPrice(`$0.00`)          // 0
unformatPrice(`123.45`)         // 123.45
unformatPrice(`1,234.5`)        // 1234.5
unformatPrice(123.45)           // 123.45
unformatPrice(0)                // 0
unformatPrice(`Not a price`)    // null
unformatPrice(``)               // null
unformatPrice(false)            // null
unformatPrice(null)             // null
unformatPrice(undefined)        // null
```

## `toCents`

Converts dollars to cents (i.e. multiplies by 100).

Takes either a number or numeric string as input and can handle different input formats to a reasonable degree. Returns `null` if the input value is falsey (non-zero) or not number-like at all.

Examples:
```javascript
toCents(`$123.45`)      // 12345
toCents(`1,234.56`)     // 123456
toCents(`$9,001`)       // 900100
toCents(-1234.56)       // -123456
toCents(0)              // 0
toCents(`Not a price`)  // null
toCents(null)           // null
toCents(undefined)      // null
toCents(false)          // null
toCents({})             // null
toCents([])             // null
```


## `toDollars`

Converts cents to dollars (i.e. divides by 100) and optionally formats the output as currency.

Takes either a number or numeric string as input and can handle different input formats to a reasonable degree. **The input value is always assumed to be in cents even if it contains a dollar sign (see code example down below)**.

By default, the function returns a number when the input is valid (number-like) or `null` when the input is invalid (non-zero falsey/non-number-like).

Optionally, `true` can be passed for the 2nd argument to format the output as US currency. In this case, the function returns a US currency-formatted string when the input is valid or an empty string when the input is invalid.

Examples:
```javascript
toDollars(123)              // 1.23
toDollars(123, true)        // `$1.23`

toDollars(234.56)           // 2.35
toDollars(234.56, true)     // `$2.35`

toDollars(0)                // 0
toDollars(0, true)          // `$0.00`

toDollars(`0.1`)            // 0
toDollars(`0.1`, true)      // `$0.00`

toDollars(`900,001`)        // 9000.01
toDollars(`900,001`, true)  // `$9,000.01`

// IMPORTANT: make note of this behavior
toDollars(`$9,001`)         // 90.01
toDollars(`$9,001`, true)   // `$90.01`

toDollars(null)             // null
toDollars(null, true)       // ``

toDollars(undefined)        // null
toDollars(undefined, true)  // ``

toDollars(false)            // null
toDollars(false, true)      // ``
```
