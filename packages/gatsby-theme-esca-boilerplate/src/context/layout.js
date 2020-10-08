import React, { useReducer, useContext, createContext } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { sizes } from '../styles/variables'


const query = graphql`
  query LayoutQuery {
    siteSettings: sanitySiteSettings {
      _rawNavigation(resolveReferences: { maxDepth: 10 })
      _rawAlertBarContent
      headerLogo {
        asset {
          url
        }
      }
    }
  }
`

/**
 * This context provides all relevant layout state/information to components
 * needing it. This includes content as well as calculated CSS height of header
 * (mobile & desktop) based on content that is populated (alert bar/breadcrumbs)
 */
const LayoutContext = createContext()


export const useLayoutState = () => useContext(LayoutContext)


export default function Provider(props) {
	const { children, breadcrumbs } = props
	const { siteSettings } = useStaticQuery(query)

	const hasAlert = !!siteSettings?._rawAlertBarContent
	const hasCrumbs = !!breadcrumbs?.length

	// The "pieces" that make up the header's overall height
	const pieces = [sizes.navHeight]
	hasCrumbs && pieces.push(sizes.breadcrumbsHeight)

	// Only factor alert bar into height on desktop
	const piecesMobile = [...pieces]
	hasAlert && pieces.push(sizes.alertBarHeight)

	// Calculate total height for mobile & desktop
	const headerHeight = `calc(${pieces.join(` + `)})`
	const headerHeightMobile = `calc(${piecesMobile.join(` + `)})`

	const reducer = (state, newState) => ({ ...state, ...newState })
	const initialState = {
		headerHeight,
		headerHeightMobile,
		siteSettings,
		breadcrumbs,
	}

	const [layoutState, setLayoutState] = useReducer(reducer, initialState)
	const contextValue = [layoutState, setLayoutState]

	return (
		<LayoutContext.Provider value={contextValue}>
			{children}
		</LayoutContext.Provider>
	)
}
