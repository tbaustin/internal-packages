import React, { useState, useRef } from 'react'
import { css } from '@emotion/core'
import {
  IoIosFunnel as FilterIcon,
  IoIosArrowDown as DropdownIcon
} from 'react-icons/io'
import { FaSort as SortIcon } from 'react-icons/fa'
import CallToAction from '../../components/call-to-action'
import { useFilterAndSort } from './filter-and-sort-context'
import { LightboxFiltersSection } from './filters-section'
import { breakpoints } from '../../styles/variables'


export default function Toolbar(props) {
  const { filterSettings } = props

  const [modalActive, setModalActive] = useState(false)
  const openModal = () => setModalActive(true)
  const closeModal = () => setModalActive(false)

  const { actions } = useFilterAndSort()
  const { sortProducts } = actions

  const handleSelectSort = e => {
    switch(e.target.value) {
      case `relevance`:
        sortProducts()
        break
      case `nameAsc`:
        sortProducts(`asc`, `name`)
        break
      case `nameDesc`:
        sortProducts(`desc`, `name`)
        break
      case `priceAsc`:
        sortProducts(`asc`, `variants[0].price`)
        break
      case `priceDesc`:
        sortProducts(`desc`, `variants[0].price`)
        break
      default:
        break
    }
  }

  const selectRef = useRef()
  const selectEl = selectRef.current
  const sortText = selectEl?.options?.[selectEl?.selectedIndex]?.text

  return (
    <div css={toolbarStyles}>
      <CallToAction
        className="icon-button mobile-only"
        onClick={openModal}
        text={(
          <>
            <FilterIcon />
            Filter
          </>
        )}
      />
      <LightboxFiltersSection
        filterSettings={filterSettings}
        active={modalActive}
        onClose={closeModal}
      />
      <CallToAction
        className="icon-button"
        text={(
          <>
            <SortIcon />
            <span className="small-text">
              Sort by: {sortText || `Relevance`}&nbsp;
            </span>
            <select ref={selectRef} onChange={handleSelectSort}>
              <option value="relevance">Relevance</option>
              <option value="nameAsc">Name (A - Z)</option>
              <option value="nameDesc">Name (Z - A)</option>
              <option value="priceAsc">Lowest Price</option>
              <option value="priceDesc">Highest Price</option>
            </select>
            <DropdownIcon />
          </>
        )}
      />
    </div>
  )
}


const toolbarStyles = css`
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .icon-button {
    max-width: 14rem;
    height: 2.5rem;
    margin: 0;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    position: relative;
    font-weight: normal;
    text-transform: unset;

    .small-text {
      font-size: 0.85rem;
    }

    &.mobile-only {
      @media(${breakpoints.laptop}) {
        visibility: hidden;
      }
    }

    svg:not(:last-child), svg:only-child {
      margin-right: 0.5rem;
    }

    select {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
  }
`
