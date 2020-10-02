import React from 'react'
import { Link } from 'gatsby'


export default function Crumb(props) {
	const {
		crumb: crumbProp,		// Item in original array representing this crumb
		tag: parentTagProp,	// Custom crumb tag specified in <Breadcrumbs> props
		innerProps,					// Custom props for inner element set on <Breadcrumbs>
	} = props

	// So that below destructuring works
	const crumb = typeof crumbProp === `string` ? {} : crumbProp

	const {
		href,
		to,
		link,
		path,
		url,
		text,
		label,
		disableLink,
		tag: tagProp,
		...restProps
	} = crumb

	// Look for several props that can be used as a destination URL for the link
	const destination = href || to || link || path || url || ``

	/**
	 * Whether this crumb should be treated as a link
	 * Not a link if no destination URL found in props, entire crumb is string
	 * instead of object, or link has been disabled for the crumb by setting
	 * disableLink to true
	 */
	const isPlainText = disableLink || typeof crumb === `string` || !destination

	/**
	 * For links, by default:
	 *	- use <a> tag for absolute URLs
	 *	- use Gatsby <Link> for relative by default
	 */
	const defaultLinkTag = destination.startsWith(`http`) ? `a` : Link

	// By default for non-links, use <span> or custom tag set on <Breadcrumbs>
	const defaultTextTag = parentTagProp || `span`

	// Use either custom tag set for this crumb or default as determined above
	const Tag = tagProp || (isPlainText ? defaultTextTag : defaultLinkTag)

	// Use link-related props depending on type of tag being rendered
	const destKey = Tag === `a` ? `href` : `to`
  const destProp = { [destKey]: destination}
  const isLink = (Tag === `a` || typeof Tag === 'object')
  
  const schemaProps = {
    itemProp : isLink ? 'item' : 'name'
  }

	// Merge all final props together
	const allProps = {
		...!isPlainText && destProp, // Link destination (if link being rendered)
		...innerProps,							 // Custom props chosen at parent level
    ...restProps,								 // Custom props set for this specific crumb
    ...schemaProps,
	}

	const displayText = typeof crumbProp === `string`
		? crumbProp
		: (text || label || destination)

	return (
		<Tag {...allProps}>
      {isLink ? (
        <span itemProp="name">{displayText}</span>
      ) : displayText}
		</Tag>
	)
}
