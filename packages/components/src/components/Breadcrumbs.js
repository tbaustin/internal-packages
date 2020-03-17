/** @jsx jsx */ import { jsx, css } from '@emotion/core'
import { Link } from 'gatsby'

const Crumb = ({ crumb: crumbProp }) => {
	const crumb = typeof crumbProp === `string` ? {} : crumbProp
	const {
		href,
		to,
		link,
		path,
		url,
		text,
		disabledLink,
		linkComponent,
		...restProps
	} = crumb
  
	const destination = href || to || link || path || url || ``
	const isPlainText = disabledLink || typeof crumb === `string` || !destination
	const defaultLinkComp = destination.startsWith(`http`) ? `a` : Link
  
	const Tag = isPlainText ? `div` : (linkComponent || defaultLinkComp)
	const destKey = Tag === `a` ? `href` : `to`
	const destProp = Tag === `div` ? {} : { [destKey]: destination} 
  
	const allProps = {...destProp, ...restProps}

	return (
		<Tag {...allProps}>
			<span>{isPlainText ? crumbProp : (text || destination)}</span>
		</Tag>
	)
}

export default function Breadcrumbs(props) {
	const {
		crumbs,
		length,
		separator,
		beginSeparator,
		endSeparator,
		...restProps
	} = props

	let updatedCrumbs = [ ...crumbs ]

	if(length && crumbs.length > length) {
		updatedCrumbs.slice(1, crumbs.length - length)
		updatedCrumbs[1] = `...`
	}
  
	return (
		<ul css={defaultStyles} {...restProps}>
			{updatedCrumbs.map((crumb, i) => {
				const begin = i === 0
				const end = i === (updatedCrumbs.length - 1)
				const renderBeginSeparator = beginSeparator && (typeof beginSeparator === `boolean` ? separator : beginSeparator)
				const renderEndSeparator = endSeparator && (typeof endSeparator === `boolean` ? separator : endSeparator)

				return (
					<li key={i}>
						{begin && renderBeginSeparator}
						<Crumb crumb={crumb} separator={separator} />
						{!end && separator}
						{end && renderEndSeparator}
					</li>
				)
			})}
		</ul>
	)
}

const defaultStyles = css`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row wrap;
	li {
		display: flex;
		flex-flow: row nowrap;
	}
`