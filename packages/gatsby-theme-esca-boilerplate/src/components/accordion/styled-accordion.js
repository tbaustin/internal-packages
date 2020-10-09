import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import 'react-accessible-accordion/dist/fancy-example.css'
import { Accordion } from 'react-accessible-accordion'
import { colors } from '../../styles/variables'


const StyledAccordion = styled(Accordion)(props => {
  const { condensed } = props
  const padding = condensed ? `0.75rem` : `1rem`
  const iconSize = condensed ? `1rem` : `1.5rem`

  return css`
    width: 100%;

    .accordion__button {
      background: ${colors.white};
      color: ${colors.grey};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: ${padding};

      :focus {
        border: none;
        outline: none;
      }

      :before {
        display: none;
      }

      .plusIcon {
        font-size: ${iconSize};
      }
    }

    .accordion__panel {
      padding: ${padding};
    }
  `
})


export default StyledAccordion
