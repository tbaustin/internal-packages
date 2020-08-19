import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'

import { colors } from '../../styles/variables'

export default function RadioHorizontalLinked(props){
	const { onChange, field, ...rest } = props
	const { choices } = field

	const [list, setList] = useState(choices?.map?.(({ value }) => value) || [])
	const [choice, setChoice] = useState(null)

	const [activeInput, setInput] = useState(false)
	const [inputValue, setVal] = useState(null)
	
	function handleToggle(value) {
		setChoice(value)
	}

	function handleInput(e) {
		const { value } = e.target
		setVal(value)
	}

	function handleSubmit(){
		setList([...list, inputValue])
		setChoice(inputValue)
		setInput(false)
	}

	useEffect(() => {
		onChange(choice)
	}, [choice])

	return (
		<div css={styles} {...rest}>
			<ul className="choices">
				{list?.map?.((value, i) => {
					return (
						<li key={i} className={`choice ${value === choice ? `active` : ``}`} onClick={() => handleToggle(value)}>
							{value}
						</li>
					)
				})}
			</ul>
			{activeInput 
				? (
					<div className={`addInput`}>
						<form onSubmit={handleSubmit}></form>
						<input type="text" onChange={handleInput} />
						<span onClick={handleSubmit}>Add</span>
					</div>
				)
				: <button className={`addYourOwn`} onClick={() => setInput(true)}>Add Your Own +</button>
			}
			
		</div>
	)
}

const styles = css`
	ul {
		list-style: none;
		margin: 5px;
		padding: 0;
	}
	.addInput {
		display: flex;
		input {
			width: 100%;
			outline: none;
			color: ${colors.red};
			text-align: center;
		}
		span {
			border: 1px solid;
			padding: 10px;
			cursor: pointer;
		}
	}
	.choices {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: space-evenly;
		.active {
			color: ${colors.white};
			background: ${colors.red};
			border-color: ${colors.white};
		}
	}
	.choice {
		border: 1px solid #333;
		padding: 5px 20px;
		text-align: center;
		width: 100%;
		margin: 10px 0;
		cursor: pointer;
		max-width: 200px;
	}
	.addYourOwn {
		display: block;
		max-width: 200px;
		width: 100%;
		padding: 5px 20px;
		text-align: center;
		cursor: pointer;
		outline: none;
		margin: 0 auto;
		color: ${colors.red};
	}
`