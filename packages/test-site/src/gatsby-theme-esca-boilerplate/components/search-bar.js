import React from 'react'
import { css } from '@emotion/core'
import OldSearchBar from 'gatsby-theme-esca-boilerplate/src/components/search-bar'


export default function SearchBar(props) {
  // console.log("I AM MODIFIED!!")
  return (
    <OldSearchBar
      bogus="Whoopty-doo"
      {...props}
      css={styles}
    />
  )
}


const styles = css`
  #search {
    background: khaki;
  }
`
