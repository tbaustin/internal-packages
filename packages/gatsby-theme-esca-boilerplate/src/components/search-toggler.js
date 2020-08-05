import React, { useReducer } from 'react'
import { css } from '@emotion/core'
import { FaSearch } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import SearchBar from './search-bar'
import { navItem, variables } from '../styles'

const { breakpoints } = variables


export default function SearchToggler() {
  const [active, toggle] = useReducer(current => !current, false)

  const Icon = active ? MdClose : FaSearch

  return (
    <>
      <div css={styles}>
        <Icon onClick={toggle} />
      </div>
      <SearchBar active={active} />
    </>
  )
}


const styles = css`
  ${navItem}

  svg {
    color: #999;
  }

  @media(${breakpoints.laptop}) {
    border-left: 1px solid #666;
    padding-left: 20px;

    svg {
      color: black;
    }
  }
`
