import React from 'react'
// import loadable from '@loadable/component'
import get from 'lodash/get'
import produce from 'immer'
import SanityBlockContent from '@sanity/block-content-to-react'
import { Link } from 'gatsby'
import H1Substitute from '../components/h1-substitute'
import * as allWidgets from './all'
import { useTemplateEngine } from '../context/template-engine'


/**
 * To create a dynamically-importable component
 * Avoids having every possible component in every file
 */
// const AsyncWidget = loadable(props => import(`./${props._type}`))


/**
 * Dynamic component for all links found in block content
 * Uses either <a> or <Link> depending on URL type
 */
const linkMark = props => {
  const { mark, children } = props
  const { href } = mark

  const Tag = href.startsWith(`http`) ? `a` : Link
  const destKey = Tag === `a` ? `href` : `to`
  const destProp = { [destKey]: href }

  return (
    <Tag {...destProp}>
      {children}
    </Tag>
  )
}

const colorMark = props => {
  const color = get(props, `mark.color.hex`)
  return <span style={{ color }}>{props.children}</span>
}


/**
 * Renderer to handle the regular "block" type
 *
 * Needed for things like heading-style text that looks like <h1> but doesn't
 * actually render an <h1> tag (for SEO purposes)
 */
const genericBlockRenderer = props => {
  // Apply global CSS class to make 'h1Substitute' style appear like <h1>
  if (props.node?.style === `h1Substitute`) {
    return <H1Substitute {...props} />
  }

  // Fall back to default handling for every other style
  return SanityBlockContent.defaultSerializers.types.block(props)
}



const getSerializers = schema => {
  if (!schema?.length) return {}

  // The widget types in Sanity schema (ending in "Widget")
  const cmsWidgets = schema.filter(type => {
    return /^\w+Widget$/.test(type.name)
  })

  // Set up dynamically-importable block type components based on widget types
  const blockTypes = cmsWidgets.reduce((types, widgetType) => {
    const { name } = widgetType
    // const widget = props => <AsyncWidget {...props.node} />
    const WidgetComponent = allWidgets[name]
    const widget = props => <WidgetComponent {...props.node} />
    return { ...types, [name]: widget }
  }, {})

  // Add in handler for regular "block" type
  blockTypes.block = genericBlockRenderer

  return {
    types: blockTypes,
    marks: {
      link: linkMark,
      color: colorMark,
    }
  }
}



/**
 * Replaces template variables in text spans throughout an entire tree of block
 * content; does not mutate original data
 */
const transformBlocks = (oldBlocks, templateEngine) => {
  const transform = blocks => {
    for (let block of blocks) {
      if (block._type === `span` && block.text) {
        block.text = templateEngine.parse(block.text)
      }
      if (block?.children?.length) {
        transform(block.children)
      }
    }
  }

  // Do the transformation immutably
  return produce(oldBlocks, draft => {
    transform(draft)
  })
}



export default function ContentRenderer(props) {
  const { blocks, ...other } = props

  const templateEngine = useTemplateEngine()

  const serializers = getSerializers(templateEngine?.schema)

  /**
   * Parse template syntax & replace variables if there's a template data source
   * present (that's how we know this is in a template rather than a page)
   */
  const transformedBlocks = templateEngine?.data
    ? transformBlocks(blocks, templateEngine)
    : blocks

  return (
    <SanityBlockContent
      renderContainerOnSingleChild
      serializers={serializers}
      blocks={transformedBlocks}
      {...other}
    />
  )
}
