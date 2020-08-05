import React from 'react'
import { Link } from 'gatsby'
import { useLayoutState } from '../../context/layout'
import BreadcrumbsRenderer from '../breadcrumbs-renderer'
import Container from '../container'
import AlertBar from '../alert-bar'
import Nav from '../nav'
import SearchToggler from '../search-toggler'
import CartToggler from '../cart-toggler'
import getStyles from './styles'


const NavArea = props => (
	<Container
		className="navAreaContainer"
		width="constrained"
		direction="row"
		smartPadding="0 1rem"
		{...props}
	/>
)


export default function Header() {
	const [ layoutState ] = useLayoutState()
	const { siteSettings, breadcrumbs } = layoutState

	const links = siteSettings?._rawNavigation?.header
	const alertContent = siteSettings?._rawAlertBarContent
	const logoSrc = siteSettings?.headerLogo?.asset?.url

	const styles = getStyles(layoutState)

	return (
		<header css={styles}>
			<AlertBar content={alertContent} />
			<NavArea>
				<Link className="logo" to="/">
					<img src={logoSrc} />
				</Link>
				<div className="navAreaItems">
					<Nav links={links} closeNav={false} />
					<SearchToggler />
					<CartToggler />
				</div>
			</NavArea>
			<BreadcrumbsRenderer crumbs={breadcrumbs} />
		</header>
	)
}
