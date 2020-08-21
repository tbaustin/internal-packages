import React from 'react'
import { css } from '@emotion/core'
import { graphql, useStaticQuery } from 'gatsby'
import Img from 'gatsby-image'

import { colors } from '../../styles/variables'

export default function FilterSwatch(props){
	const { title, values, setActiveFilters, activeFilters } = props
	const swatchQuery = useStaticQuery(graphql`
		query productListWidget {
			allSanitySwatch {
				nodes {
					primaryImage {
						asset {
							fixed(width: 30, height: 30) {
								...GatsbySanityImageFixed
							}
						}
					}
					color {
						hex
					}
					customFieldRef {
						name
					}
					value
				}
			}
		}
	`)

	const swatches = swatchQuery?.allSanitySwatch?.nodes

	function removeFilter(val) {
		const index = activeFilters[title]?.indexOf?.(val) 

		if(index !== -1){      
			setActiveFilters({
				...activeFilters,
				[title]: [
					...activeFilters[title].slice(0, index), 
					...activeFilters[title].slice(index + 1),
				],
			})
		}
	}
  
	function addFilter(val) {
		const exists = activeFilters?.[title]?.find?.(f => f === val)

		if(!exists){
			setActiveFilters({
				...activeFilters, 
				[title]: [
					...activeFilters[title] || [], val,
				],
			})
		} else {
			removeFilter(val)
		}
	}

	function renderValue(swatch, val) {
		if(swatch?.color) {
			return (
				<div 
					css={css`background: ${swatch?.color?.hex}; height: 100%; width: 100%;`}
				/>
			)

		}

		if(swatch?.primaryImage) {
			return (
				<Img fixed={swatch?.primaryImage?.asset?.fixed} />
			)
		}

		if(val) {
			return val
		}
	}
  
	return (
		<div css={styles} className="filter">
			<div className="title">{title}</div>
			<div className="values">
				<ul className="list">
					{values.map((val, i) => {
						const isActive = !!activeFilters?.[title]?.find?.(f => f === val)
						const swatch = swatches.find(s => s?.value?.toLowerCase() === val?.toLowerCase())
						
						return (
							<li className="listItem" key={i}>
								<div className={`swatch tooltip ${isActive && `active`}`} onClick={() => addFilter(val)}>
									{renderValue(swatch, val)}
									<span className="tooltiptext">{val}</span>
								</div> 
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}

const styles = css`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
	.list {
		display: flex;
		margin: -2.5px;
	}
  .listItem {
    cursor: pointer;
		margin: 2.5px;
  }
	.swatch {
		height: 30px !important;
		width: 30px !important;
		border: 2px solid transparent;
		.gatsby-image-wrapper {
			height: 100% !important;
			width: 100% !important;
		}
	}
	.active {
		border-color: ${colors.brand}
	}
	.tooltip {
    position: relative;
    :hover {
      .tooltiptext {
        visibility: visible;
      }
    }
    .tooltiptext {
      visibility: hidden;
      background-color: black;
      color: #fff;
      text-align: center;
      padding: 5px;
      white-space: nowrap;
      border-radius: 6px;  
      position: absolute;
      z-index: 1;
			left: 0;
      bottom: -35px;
    }
  }
`