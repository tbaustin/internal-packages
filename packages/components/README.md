# @escaladesports/components
Reusable React components for Escalade Sports sites/apps

Components:
- [Breadcrumbs](#breadcrumbs)
- [AttributeWidgets](#attributewidgets)

---

# `<Breadcrumbs>`
For rendering navigational breadcrumbs at the top of a page. Renders a fully-customizable `<ul>` and includes forward slashes inside the `<li>` elements to act as separators by default.
### Example Usage
```javascript
const crumbs = [
  {
    to: `/`,
    label: `Home`
  },
  <SomeComponent />,
  `Plain Text Crumb`,
  {
    href: `https://escaladesports.com`,
    text: `Random External Link`,
    tag: SomeOtherComponent
  },
  <div>Totally custom!</div>
  {
    link: `/check-me-out`,
    text: `Notice the different properties accepted`
  }
]

return (
  <Breadcrumbs
    crumbs={crumbs}
    length={3}
    ellipsis="...."
    separator={<SlashIcon />}
    beginSeparator
    endSeparator="/ THE END"
    css={customBreadcrumbStyles}
  />
)
```
### The `crumbs` Prop
An array of objects, strings, or React elements representing the crumbs.

Each crumb object can contain a destination URL property (see below table) to make the crumb a link. Inside the `<li>` for the crumb, an anchor tag will be rendered if the URL is absolute (starts with *http*), or a Gatsby `<Link>` will be rendered if the URL is relative. Non-link crumbs will use a `<span>`. Otherwise, a custom component can be specified (see `tag` below).

When using an object for a crumb, the following properties are accepted:

| Property | Description | Alternatives |
| --- | --- | --- |
| `to` | Destination URL (either relative or absolute). | `href`, `link`, `path`, `url`
| `text` | The text to be displayed for the crumb | `label`
`disableLink` | Boolean to force rendering as plain text even if a destination URL is provided
| `tag` | Custom React component to use in place of `<a>`, `<span>`, or `<Link>` (overrides the `tag` prop given to the main component on a crumb-by-crumb basis)
| `listItemProps` | Props to be applied to the `<li>` element (overrides `listItemProps` given to the main component on a crumb-by-crumb basis)
| all other properties | Will be spread to the inner tag as props (merged with `crumbProps` prop from main component)


### All Props for `<Breadcrumbs>`
| Prop | Description | Default Value | Alternative Props |
| --- | --- | --- | --- |
| `crumbs` | The actual crumbs (see above)
| `length` | Max # of crumbs before truncating; will replace leftmost crumbs with `ellipsis` (see below) when exceeded
| `tag` | Custom React component to use for the inner tag (*within* `<li>`) in each crumb instead of `<a>`, `<span>`, or `<Link>`
| `listItemProps` | Props to be applied to all `<li>` elements
| `crumbProps` | Props to be applied to the inner tag (*within* `<li>`) for all crumbs
| `ellipsis` | Custom element or string used when length of `crumbs` array exceeds the `length` prop (if given – see above) | `"..."` | `dots`
| `separator` | Custom string or React element to use between crumbs | `<span> / </span>`
| `beginSeparator` | String or React element to go before the first crumb; set to `true` to use the main `separator`
| `endSeparator` | Goes after the last crumb; works the same as `beginSeparator`
all other props | Will be spread to the top-level `<ul>` element

---

# `<AttributeWidgets>`
Renders groups of inputs/dropdowns for selecting product attributes (e.g. *Size* or *Color*) based on attributes described in a `config` object (see [the config prop](#the-config-prop)) and a list of product variants (see [the variants prop](#the-variants-prop)).

Automatically enables/disables options for each attribute based on combinations that actually exist in a supplied list of product variants (see [the variants prop](#the-variants-prop) below).

On select, returns the actual ID or SKU of the new product variant resulting from the new combination of attribute values.

### Example Usage
Inside or outside a React component:
```javascript
const variants = [
  {
    sku: `1ABC`,
    name: `Small Yellow Product`,
    color: `Yellow`,
    size: `Small`,
    version: `Version A`
  },
  {
    sku: `2XYZ`,
    name: `Large Blue Product`,
    color: `Blue`,
    size: `Large`,
    version: `Version A`
  },
  ...
]

const config = {
  color: {
    label: `Select a color`,
    section: `fancyWidgets`,
    component: ColorWidget
  },
  size: {
    label: `Select a size`,
    section: `dropdowns`,
    component: BasicDropdownWidget
  },
  version: {
    label: `Select a version`,
    section: `dropdowns`,
    component: BasicDropdownWidget
  }
}
```

Inside a React component:
```javascript
// Example of a change handler to deal w/ the new SKU
const handleChange = newSku => {
  setPageState({ sku: newSku })
}

return (
  <>
    <AttributeWidgets
      section="fancyWidgets"
      config={config}
      variants={variants}
      initial={variants[0].sku}
      onChange={handleChange}
    />
    <div className="other-area-in-layout">
      <AttributeWidgets
        section="dropdowns"
        config={config}
        variants={variants}
        initial={variants[0].sku}
        onChange={handleChange}
      />
    </div>
  </>
)
```

### The `config` Prop
Object defining the selectable attributes.

Keys should match corresponding properties on each variant in the `variants` array (see below). For example: if one of the keys in `config` is `size`, at least one of the product variants should have a `size` property.

Values should be objects with these properties:

| Property | Description | Default Value |
| --- | --- | --- |
| `label` | The label to be displayed to the user next to the input. If using a custom component, this may not be needed.
| `section` | The name (as a string) of the section/group that should contain the input widget for this attribute. Should correspond to the `section` prop passed to one of the instances of the main `<AttributeWidgets>` component.
| `component` | Custom component to be used as the selection input for the attribute. Receives `options`, `label`, `value`, and `onChange` as props. | Built-in generic dropdown component

### The `variants` Prop
Array of related variations of a product. Each member of the array should be an object containing at minimum:  
- A `sku`, `id`, or similar identifier (key must match the `identifier` prop passed to `<AttributeWidgets>` – defaults to `sku`)
- Properties with keys corresponding to the attributes in `config` (see above)

### Other Props
| Prop | Description | Default Value |
| --- | --- | --- |
| `variants` | See above
| `config` | See above
| `initial` | The ID value of the initial variant to be selected
| `onChange` | Change handler called when any option is selected in any of the attribute selection inputs. The argument passed is the ID of whichever product variant has the new combination of attribute values resulting from the selection.
| `section` | An optional name string for a section/group of attribute widgets; ensures that the instance will only render widgets for attributes having a matching value for `section` in `config`. **Use this to render different inputs in different places on a page.**
| `identifier` | Property name to use as the ID on each product variant | `"sku"`
| `debug` | Activates some additional console logging
| `test` | Forces component to use built-in test data
