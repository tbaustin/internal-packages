import React from 'react'
import { css } from '@emotion/core'
import { sizes } from '../styles/variables'


const getCSSDimension = value => {
	switch (typeof value) {
		case `number`:
			return `${value}px`
		case `string`:
			return value
		default:
			return value ? `1rem` : `0px`
	}
}


export default function Container(props) {
	const {
		margin,
		padding,
		smartPadding,
		width,
		align,
		justify,
		direction,
		component,
		wrapperProps,
		css: overrideCss,
		...other
	} = props

	const widthStyle = widthStyles[width || `fit`]

	const defaultAlign = direction === `row` ? `stretch` : `center`
	const defaultJustify = direction === `row` ? `space-between` : `center`

	const style = css`
    ${widthStyle}
		flex: 1;
    display: flex;
    flex-direction: ${direction || `column`};
    ${direction === `row` ? rowStyle : ``}
    align-items: ${align || defaultAlign};
    justify-content: ${justify || defaultJustify};
    margin: ${getCSSDimension(smartPadding || margin)};
    padding: ${getCSSDimension(padding)};
  `

	const Tag = component || `div`
	const inner = <Tag css={style} {...other} />

	const shouldRenderWrapper = smartPadding && width === `constrained`

	return !shouldRenderWrapper ? inner : (
		<div css={[wrapperStyle, overrideCss]} {...wrapperProps}>
			{inner}
		</div>
	)
}


const wrapperStyle = css`
  width: 100%;
  display: flex;
  justify-content: center;
`

const rowStyle = css`
  flex-wrap: wrap;
`

const widthStyles = {
	fit: ``,
	full: css`
    width: 100%;
  `,
	constrained: css`
    width: 100%;
    max-width: ${sizes.constrainWidth};
  `,
}
