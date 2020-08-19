import React, { useRef, useEffect } from 'react'
import { css } from '@emotion/core'

export default function TestWidget(props) {
	const { leaf } = props
	const ref = useRef(null)

	useEffect(() => {
		if(ref?.current){
			leaf.DomEvent.disableClickPropagation(ref.current)
		}
	}, [])

	return (
		<div
			css={styles} 
			className="container"
			ref={ref}
		>
			<div className="topLeft">
				<div className="textBox">
					<p>Here is some text</p>
				</div>
			</div>
		</div>
	)
}

const styles = css`
  user-select: none;
  cursor: grab;
  font: 12px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif;
  box-sizing: inherit;

  .topLeft {
    left: 0;
    top: 0;
    position: absolute;
    z-index: 1000;
    pointer-events: none;
  }

  .textBox {
    background: #fff;
    padding: 15px;
    margin: 130px 0 0 10px;
    box-shadow: 0 1px 5px rgba(0,0,0,0.65);
    border-radius: 4px;
    cursor: pointer;
    float: left;
    clear: both;
    position: relative;
    z-index: 800;
    pointer-events: auto;
  }
`