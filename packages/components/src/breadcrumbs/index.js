/** @jsx jsx */
import { isValidElement } from 'react'
import { jsx } from '@emotion/core'
import { defaultStyles, DefaultSeparator } from './defaults'
import Crumb from './crumb'



export default function Breadcrumbs(props) {
	const {
		tag,
		length,
		listItemProps,
		crumbProps,
		ellipsis,
		dots,
		crumbs: crumbsProp,
		separator: separatorProp,
		beginSeparator: beginSeparatorProp,
		endSeparator: endSeparatorProp,
		...restProps
	} = props

	// Use copy of crumbs array passed as prop
	let crumbs = [ ...crumbsProp ]

	// Truncate crumbs if length exceeded (use custom dots element if provided)
	if (length && crumbsProp.length > length) {
		crumbs.slice(1, crumbsProp.length - length)
		crumbs[1] = ellipsis || dots || `...`
	}

	/**
	 * Use custom separator element or the default if none passed
	 * Also covers case where props.separator === false/null (show none)
	 */
	const separator = typeof separatorProp === `undefined`
		? <DefaultSeparator />
		: separatorProp

	/**
	 * Prop for beginning separator
	 * Can be custom element or set to true to show default
	 */
	const beginSeparator = beginSeparatorProp === true
		? separator
		: beginSeparatorProp

	// Prop for ending separator - same behavior as above
	const endSeparator = endSeparatorProp === true
		? separator
		: endSeparatorProp

	return (
		<ul css={defaultStyles} {...restProps}>
			{crumbs.map((crumb, i) => {
				/**
				 * Allow props for <li> elements to be set individually (in crumb
				 * objects) or in batch (set once as props on <Breadcrumbs>)
				 */
				const liProps = crumb.listItemProps || listItemProps

				// Prevent setting a listItemProps attribute on elements within <li>
				delete crumb.listItemProps

				/**
				 * Check if the entire crumb is a custom rendered React element
				 * If so, it will simply be set in place as-is instead of rendering a
				 * crumb like normal (see below)
				 */
				const isElement = isValidElement(crumb)

				const begin = i === 0
				const end = i === (crumbs.length - 1)

				return (
					<li key={`crumb-${i}`} {...liProps}>
						{begin && beginSeparator}
						{isElement ? crumb : (
							<Crumb
								tag={tag}
								crumb={crumb}
								innerProps={crumbProps}
							/>
						)}
						{!end && separator}
						{end && endSeparator}
					</li>
				)
			})}
		</ul>
	)
}
