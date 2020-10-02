import React from 'react'
import { css } from '@emotion/core'

export default function FilterList(props){
	const { title, values, setActiveFilters, activeFilters } = props

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
		}
	}

	return (
		<div css={styles} className="filter">
			<div className="values">
				<ul className="list">
					{values.map((val, i) => {
						const isActive = !!activeFilters?.[title]?.find?.(f => f === val)

						return (
							<li className="listItem" key={i}>
								<div className="text" onClick={() => addFilter(val)}>
									{val}
								</div>
								{isActive && <div onClick={() => removeFilter(val)}>X</div>}
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
  .listItem {
    cursor: pointer;
    display: flex;
    .text {
      margin-right: 10px;
    }
  }
`
