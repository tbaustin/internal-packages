# sanity-template-engine
An engine for parsing a user-friendly template syntax. To be used with a Sanity schema.

---

# Usage

### 1. Have the Sanity schema ready
The engine requires an array of [Sanity schema types](https://www.sanity.io/docs/schema-types). Get this data by any means available; it should be the same as the array you would pass to `schemaTypes.concat()` (see [Sanity docs](https://www.sanity.io/docs/schema-types)).

**Note:** This engine only cares about the `name`, `title`, `type`, and `fields` properties of each type (each field within `fields` array should have this information as well). Anything else is unnecessary and doesn't need to be fetched/assembled.

### 2. Instantiate the template engine
Create an instance of the template engine:
```javascript
import TemplateEngine from '@escaladesports/sanity-template-engine'

// Your own implementation here
const schema = getSchema()
const data = getData()

// 'new' keyword not required
const engine = TemplateEngine({ schema, data })
```

The main `TemplateEngine` function takes an object with these required properties:
- `schema` – the Sanity schema
- `data` – a Sanity document to use as the source of values to replace template variables

**Important Notes:**
- The `data` property above should be formatted like a proper Sanity query response (i.e. an object with `_id`, `_type`, and other properties). **The engine will not work unless the `_type` property is present on the document at the top level.**
- The engine works with reference field types in the `schema`, but reference *values* in the `data` should be fully resolved (i.e. having a `_ref` property is not enough)

### 3. Use the template engine
```javascript
// To replace template variables in a full content excerpt
const excerpt = `Hello. My name is {{Person Info:First Name}} {{Person Info:Last Name}}`
const parsedExcerpt = engine.parse(excerpt)

// To get the value for a single variable
const value = engine.resolveProperty(`Person Info:Full Name`)
```
The template syntax uses double curly braces to place variables in text. Within the double curly braces, the `title` for a field in Sanity should be used (spaces are allowed). This is to make things more user-friendly, as users can refer to the input labels they're actually able to see in the UI.

#### Objects
Subfields of an object type are accessed with a colon, so something like `Person Info:First Name` may translate to something like `info.firstName` depending on the schema.

#### Arrays
Members of an array type are accessed with a colon followed by the index (starting at 1 to be intuitive for non-developers). For example, something like `Profile:Images:1` might translate to something like `profile.images[0]` depending on the schema.

# Provided Functions
Instances of the engine offer these 2 functions:
- `parse()` – Takes an excerpt containing variables in curly braces & returns the excerpt with values substituted in
- `resolveProperty()` – Gets the value for a single property (without curly braces)

Both of the above functions take an optional 2nd argument for a custom data source. By default, they use the `data` property passed to the engine when it was instantiated.
