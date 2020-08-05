import React, { useState, useRef, useEffect } from 'react'
import { navigate } from 'gatsby'
import { css } from '@emotion/core'
import { FaSearch } from 'react-icons/fa'
import { useLayoutState } from '../context/layout'
import { navIcon, variables } from '../styles'

const { sizes, breakpoints, colors, shadows } = variables


export default function SearchBar({ active, className, bogus }) {
  // console.log("className:", className)
  // console.log("bogus prop:", bogus)
  const inputRef = useRef(null)

	useEffect(() => {
		if (inputRef?.current && active) {
			inputRef?.current?.focus?.()
		}
	}, [active])

  const [inputValue, setInputValue] = useState(``)

  const handleChange = e => setInputValue(e?.target?.value)

	const submitSearch = e => {
		e.preventDefault()
		navigate(`/search/${inputValue}`)
	}

  const [ layoutState ] = useLayoutState()
  const styles = getStyles(layoutState)
  console.log("styles:", styles)

  return !active ? null : (
    <form css={styles} className={className} onSubmit={submitSearch}>
      <input
        ref={inputRef}
        placeholder="Search entire store here..."
        type="text"
        id="search"
        value={inputValue}
        onChange={handleChange}
      />
      <FaSearch onClick={submitSearch} />
    </form>
  )
}


const getStyles = layoutState => {
  const { headerHeight, headerHeightMobile, breadcrumbs } = layoutState

  // Subtract height of breadcrumbs to overlap them if they're present
  const getVerticalPosition = activeHeaderHeight => !!breadcrumbs?.length
		? `calc(${activeHeaderHeight} - ${sizes.breadcrumbsHeight})`
		: activeHeaderHeight

  return css`
    width: 100vw;
    max-width: ${sizes.constrainWidth};
    margin: 0 auto;

    position: absolute;
    top: ${getVerticalPosition(headerHeightMobile)};
    right: 0;
    left: 0;

    @media(${breakpoints.laptop}) {
      top: ${getVerticalPosition(headerHeight)};
    }

    z-index: 100;
    box-shadow: ${shadows.high};

    svg {
      ${navIcon}
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      color: ${colors.red};
    }

    #search {
      width: 100%;
      padding: 20px 20px;
      outline: none;
      font-size: 16px;

      @media(${breakpoints.laptop}) {
        padding: 20px 100px;
        font-size: 18px;
      }
    }
  `
}
