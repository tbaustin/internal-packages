import React, { useState, useEffect } from 'react'
import Link from 'gatsby-link'
import { css } from '@emotion/core'
import Layout from '../layout'
import Container from '../components/container'
import CallToAction from '../components/call-to-action'
import { search } from '../search'
import { colors, breakpoints } from '../styles/variables'



const ResultsDisplay = props => {
	const { loading, results, submittedTerm } = props
	const hasResults = Boolean(results?.length)

	if (loading) return (
		<h3>
			Searching for <em>"{submittedTerm}"</em>...
		</h3>
	)

	if (hasResults) return (
		<>
			<h3>
				Results for <em>"{submittedTerm}"</em>
			</h3>
			<ul css={searchListCss}>
				{results.slice(0, 10).map(({ salsify, path, sku }, index) => {
					return (
						<li className={`searchItem`} key={`searchResult${index}`}>
							<Link className={`result`} to={path || `/product/${sku}`}>
								{salsify?.[`Item Name`] || sku}
							</Link>
						</li>
					)
				})}
			</ul>
		</>
	)

	if (submittedTerm) return (
		<h3>
			No results found for <em>"{submittedTerm}"</em>
		</h3>
	)

	return null
}



export default function SearchPage() {
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState([])
	const [term, setTerm] = useState(``)
	const [submittedTerm, setSubmittedTerm] = useState(``)


	const startSearch = async (customTerm = term) => {
		// Save the term that is being searched for display purposes
		setSubmittedTerm(customTerm)

		// Visually update URL
		if (window?.history?.replaceState) {
			let path = encodeURIComponent(customTerm).replace(/%20/g, `+`)
			window.history.replaceState({}, ``, `/search/${path}`)
		}

		setLoading(true)
		const searchResults = await search(customTerm)
		setLoading(false)
		setResults(searchResults)
	}


	const handleInputEvent = event => {
		const { type, key, currentTarget } = event
		setTerm(currentTarget?.value || ``)
		if (key === `Enter`) startSearch()
	}


	useEffect(() => {
		// Check URL for search term
		const path = document.location.pathname.split(`/`)
		if (path.length !== 3) return

		// Set initial search term from URL parameter if found
		let urlTerm = decodeURIComponent(
			path.pop().replace(/\+/g, `%20`)
		)
		startSearch(urlTerm)
	}, [])


	return (
		<Layout title='Search'>
			<Container width="constrained" smartPadding>
				<h1>Search</h1>
				<input
					type="text"
					placeholder="Enter a new search term here"
					css={searchInputStyle}
					disabled={loading}
					value={term}
					onChange={handleInputEvent}
					onKeyUp={handleInputEvent}
				/>
				<CallToAction
					text="submit"
					onClick={() => startSearch()}
				/>
				<ResultsDisplay
					loading={loading}
					submittedTerm={submittedTerm}
					results={results}
				/>
			</Container>
		</Layout>
	)
}



const searchInputStyle = css`
	padding: 0.75rem;
	font-size: 1.25rem;
	border-radius: 4px;
	flex: 1;
`



const searchListCss = css`
	list-style: none;
	display: flex;
	flex-flow: row wrap;
	justify-content: space-between;
	max-width: 1000px;
	margin: 0 auto;
	padding: 0 30px;
	.searchItem {
		flex: 1 0 100%;
		font-size: 20px;
		text-align: center;
		margin-bottom: 20px;
		border: 2px solid ${colors.textDark};
		cursor: pointer;

		a {
			display: block;
			padding: 20px;
			color: ${colors.textDark};
			text-decoration: none;
		}
		:hover {
			border-color: ${colors.red};
			a {
				color: ${colors.red};
			}
		}
	}
	@media(${breakpoints.tablet}){
		.searchItem {
			flex: 0 1 calc(50% - 20px);
		}
	}
`
