import React from 'react'
import { Global } from '@emotion/core'
import { globalOverride } from '../styles'
import LayoutStateProvider, { useLayoutState } from '../context/layout'
import Header from '../components/header'
import Footer from '../components/footer'
import Cart from '../components/cart'
import getStyles from './styles'


const Structure = ({ children }) => {
  const [ layoutState ] = useLayoutState()
  const styles = getStyles(layoutState)

	return (
		<>
			<Global styles={globalOverride} />
			<main css={styles}>
				<Header />
        <div className="page-container">
          {children}
        </div>
				<Footer />
				<Cart />
			</main>
		</>
	)
}


export default function Layout(props) {
  const { children, ...other } = props

  return (
    <LayoutStateProvider {...other}>
      <Structure>
        {children}
      </Structure>
    </LayoutStateProvider>
  )
}
