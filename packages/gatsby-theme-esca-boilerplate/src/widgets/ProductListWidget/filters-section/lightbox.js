import React, { useState, useRef } from 'react'
import { css } from '@emotion/core'
import useOutsideClickListener from '../../../hooks/useOutsideClickListener'
import Modal from '../../../components/modal'
import CallToAction from '../../../components/call-to-action'
import { colors, shadows, screenWidths } from '../../../styles/variables'


export default function Lightbox(props) {
  const { active, onClose } = props

  const cardRef = useRef(null)
  useOutsideClickListener(cardRef, onClose)

  return (
    <Modal active={active} noPadding>
      <div css={cardStyles} ref={cardRef}>
        <div className="cardBody">
          {props.children}
        </div>
        <div className="cardFooter">
          <CallToAction
            text="Show Results"
            margin="0"
            onClick={onClose}
          />
        </div>
      </div>
    </Modal>
  )
}


const footerHeight = `100px`


const cardStyles = css`
  width: 100%;
  max-width: ${screenWidths.tablet};
  margin: 10vh 1rem 20vh;
  flex-direction: column;
  background: white;
  box-shadow: ${shadows.high};

  .cardBody {
    max-height: calc(70vh - ${footerHeight});
    overflow-y: auto;
  }

  .cardFooter {
    height: ${footerHeight};
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`
