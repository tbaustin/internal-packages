# @escaladesports/utils
Utility functions for use in websites & other projects

Included functions:
- [graphToArray](#graphtoarray)
- [getComponentName](#getcomponentname)
---

# `graphToArray`
Makes a plain array out of the graph structure commonly returned by GraphQL APIs. Takes an object with an `edges` array as the argument.

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

/**
 * You can also pass a 2nd argument specifying a path for returning a nested
 * property in each node that is an object (uses lodash.get)
 */
graphToArray(mockData, `someProperty`)
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
