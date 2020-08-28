import React, { useState, useEffect } from 'react'
import Link from 'gatsby-link'
import { css } from '@emotion/core'
import Layout from '../layout'
import Container from '../components/container'
import { search } from '../search'
import { colors, breakpoints } from '../styles/variables'


export default function SearchPage(){
	const [loading, setLoading] = useState(false)
	const [results, setResults] = useState([])
	const [term, setTerm] = useState(``)

	let id = 0

	async function startSearch(term){
		setTerm(term)

		// Change URL
		if (window.history && window.history.replaceState) {
			let path = encodeURIComponent(term)
			path = path.replace(/%20/g, `+`)
			window.history.replaceState({}, ``, `/search/${path}`)
		}

		id++
		const curId = id
		setLoading(true)
		const results = await search(term)
		if (curId === id) {
			setLoading(false)
			setResults(results)
		}
	}

	useEffect(() => {
		// Check URL for search term
		const path = document.location.pathname.split(`/`)
		if (path.length === 3) {
			let term = path.pop()
			term = term.replace(/\+/g, `%20`)
			term = decodeURIComponent(term)
			startSearch(term)
		}
	}, [])
	
	return (
		<Layout title='Search'>
			<Container width="constrained" smartPadding>
				<h1>Search</h1>
				<input
					css={searchInputStyle}
					type='text'
					onChange={e => startSearch(e.target.value)}
				/>
				{loading && (
					<h3>Searching for "{term}"...</h3>
				)}
				{term && !results.length && !loading && (
					<h3>No results found for "{term}".</h3>
				)}
				{!!results.length && <>
					<h3>Results for "{term}":</h3>
					<ul css={searchListCss}>
						{results.slice(0, 10).map(({ salsify, path, sku }, index) => {
							return (
								<li className={`searchItem`} key={`searchResult${index}`}>
									{/* <div> */}
										<Link className={`result`} to={path || `/product/${sku}`}>
											{salsify?.[`Item Name`] || sku}
										</Link>
									{/* </div> */}
								</li>
							)
						})}
					</ul>
				</>}
			</Container>
		</Layout>
	)
}

const searchInputStyle = css`
	padding: 0.5rem;
	font-size: 1.25rem;
	border-radius: 4px;
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
