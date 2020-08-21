import React from 'react'
import { css } from '@emotion/core'

export default function Modal(props) {
	const { active, children } = props

	return ( 
		<div css={styles} className={`modal ${active ? `activeModal` : ``}`}>
			{children}
		</div>
	)
}

const styles = css`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, .5);
  justify-content: center;
  align-items: flex-start;
  z-index: 2000;
  padding: 50px;
  &.activeModal {
    display: flex;
  }
` 