import { css } from '@emotion/core'
import * as variables from './variables'


export { variables }


// Common styles for both header & footer ("running sections" or "marginals")
export const runningSection = css`
  background: ${variables.colors.primary};
  width: 100%;

  display: flex;
  justify-content: center;
`

export const navIcon = css`
  width: 25px;
  height: 25px;
  cursor: pointer;
  position: relative;
  z-index: 101;
`

export const navItem = css`
  max-width: 50px;
  margin: 15px;

  svg {
    ${navIcon}
  }
`

export const inputField = css`
  display: flex;
  flex-direction: column;

  label {
    color: ${variables.colors.textMedium};
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  input, select {
    padding: 0.75rem;
    border: 1px solid grey;
    font-size: 1rem;
  }

  select {
    padding-right: calc(20px + .7em + 1rem);
    border-radius: 0;
		box-shadow: none;
		cursor: pointer;
		appearance: none;
    background-color: transparent;
		background-image: url(/dropdown.svg);
		background-repeat: no-repeat;
		background-position: right .7em top 50%, 0 0;
		background-size: 20px;
  }
`

export const priceText = css`
  color: ${variables.colors.red};
  font-size: 1.2rem;
  font-weight: bolder;
`

export const strikePriceText = css`
  color: ${variables.colors.textDark};
  font-size: 1em;
  text-decoration: line-through;
`

export const globalOverride = css`
  html {
    box-sizing: border-box;
    &, body {
      font-family: sans-serif;
      margin: 0;
      padding: 0;
      height: 100%;
      background: ${variables.colors.primary};
    }
  }

  p:not(:first-of-type) {
    margin-top: 0;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  /* See src/widgets/index.js */
  .h1-substitute {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
`
