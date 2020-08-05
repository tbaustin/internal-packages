import React from 'react'
import { css } from '@emotion/core'
import { FaShoppingCart } from 'react-icons/fa'
import { toggleCart } from '@escaladesports/zygote-cart'
import { navItem, variables } from '../styles'


export default function CartToggler() {
  return (
    <div css={styles}>
      <FaShoppingCart onClick={toggleCart} />
    </div>
  )
}


const styles = css`
  ${navItem}

  svg {
    color: ${variables.colors.red};
  }
`
