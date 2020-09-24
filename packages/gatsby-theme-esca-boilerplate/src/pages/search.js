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
						<li className="search-item" key={`searchResult${index}`}>
							<Link className="result" to={path || `/product/${sku}`}>
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
			path.pop().replace(/\+/g, `%20`),
		)
		startSearch(urlTerm)
	}, [])


	return (
		<Layout title='Search'>
			<Container width="constrained" smartPadding>
				<h1>Search</h1>
				<div css={inputGroupStyle}>
					<input
						type="text"
						placeholder="Enter a new search term here"
						className="search-input"
						css={inputStyle}
						disabled={loading}
						value={term}
						onChange={handleInputEvent}
						onKeyUp={handleInputEvent}
					/>
					<CallToAction
						css={submitButtonStyle}
						disabled={loading}
						className="submit-button"
						text="submit"
						onClick={() => startSearch()}
					/>
				</div>
				<ResultsDisplay
					loading={loading}
					submittedTerm={submittedTerm}
					results={results}
				/>
			</Container>
		</Layout>
	)
}



const inputGroupStyle = css`
	margin-bottom: 1rem;
	display: flex;
	justify-content: center;
	width: 100%;

	@media(${breakpoints.tablet}) {
		max-width: 600px;
	}
`

const inputElementStyle = css`
	padding: 0.75rem 1.25rem;
	font-size: 1.25rem;
	margin: 0;
	display: flex;
	align-items: center;
`

const inputStyle = css`
	${inputElementStyle}
	flex: 1;
`

const submitButtonStyle = css`
	${inputElementStyle}
	margin: 0;
`



const searchListCss = css`
	list-style: none;
	display: flex;
	flex-flow: row wrap;
	justify-content: space-between;
	padding: 0;

	.search-item {
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
		.search-item {
			flex: 0 1 calc(50% - 0.5rem);
		}
	}
`
