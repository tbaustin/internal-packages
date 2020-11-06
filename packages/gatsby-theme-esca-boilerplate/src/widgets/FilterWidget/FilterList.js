import React from 'react'
import { css } from '@emotion/core'
import { MdClose } from 'react-icons/md'
import { colors, breakpoints } from '../../styles/variables'


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
						let textClassName = `text`
						if (isActive) textClassName += ` active`

						return (
							<li key={i}>
								<div className={textClassName} onClick={() => addFilter(val)}>
									{val}
								</div>
								{isActive && <MdClose onClick={() => removeFilter(val)} />}
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

  li {
		height: 3rem;
    display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;

    .text {
      flex: 1;

			&.active {
				color: ${colors.brand};
			}
    }

		svg {
			width: 1.5em;
			height: 1.5em;
			margin-right: 1rem;
		}

		@media(${breakpoints.laptop}) {
			height: 2rem;

			svg {
				width: 1em;
				height: 1em;
				margin-right: 0;
			}
		}
  }
`
