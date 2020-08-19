import React, { useEffect, useState, useCallback, useRef } from 'react'
import { css } from '@emotion/core'
import debounce from 'lodash/debounce'

export default function Search(props){
	const { 
		onSearch, 
		proximitySearch, 
		// useLeaflet, 
		OpenStreetMapProvider,
		loadingUser,
		leaf,
	} = props

	const ref = useRef(null)
	const [radiusVal, setRadiusVal] = useState(30)
	const [searching, setSearching] = useState(false)
	const [searchInput, setSearchInput] = useState(``)
	const [location, setLocation] = useState(null)
	const [results, setResults] = useState(null)
	// const { map } = useLeaflet()
	
	const osmProvider = new OpenStreetMapProvider({
		params: {
			countrycodes: `us`, // limit search results to the Netherlands
			addressdetails: 1, 
			format: `json`,
		},
	})

	const delaySearch = useCallback(debounce(async value => {
		const results = await osmProvider.search({ query: value })
		setResults(results.slice(0, 10))
		setSearching(false)
	}, 250), [])

	async function showPosition(position){
		if(position.coords){
			const coords = `${position.coords.latitude}, ${position.coords.longitude}`
			const results = await osmProvider.search({ query: coords })
			const result = results?.[0]

			if(result){
				const { label } = result
				onSearch(result, radiusVal)
				setSearchInput(label)
				setLocation(result)
			}
		}
	}

	useEffect(() => {
		if(typeof window !== `undefined` && proximitySearch){
			window?.navigator?.geolocation?.getCurrentPosition?.(showPosition)
		}
		if(ref?.current){
			leaf.DomEvent.disableClickPropagation(ref.current)
		}
	}, [])
  
	const submitSearch = (loc) => {
		if(loc) {
			setLocation(loc)
			setSearchInput(loc?.label || ``)
			onSearch(loc, radiusVal)
		}
	}

	return (
		<div 
			css={styles}
			className={`searchContainer`}
			ref={ref}
		>
			<div className="searchInput">
				<div className={`label`}>
          Search Address
				</div>
				<div className="input">
					<input 
						type="text" 
						onChange={e => {
							setSearchInput(e.target.value)
							delaySearch(e.target.value)
						}}
						value={searchInput}
						disabled={loadingUser}
						placeholder={loadingUser ? `Loading user location...` : `Search here...`} 
					/>
				</div>
			</div>
      
			{proximitySearch && <div className="radiusInput">
				<div className={`label`}>
          Radius (miles)
				</div>
				<div className="input">
					<input 
						placeholder="Radius in miles..." 
						type="number" 
						className="radius" 
						value={radiusVal}
						onChange={e => {          
							setRadiusVal(e.target.value)
						}}
					/>
					<button
						onClick={() => {
							if(location) {
								onSearch(location, radiusVal)
							}
						}}
					>
						<div className="checkmark" />
					</button>
				</div>
			</div>}

			<div className="resultContainer">
				{(!!results?.length && !searching) && (
					<ul className="resultList">
						{results.map((result, i) => {
							const { label } = result
							return (
								<li 
									onClick={() => {
										setLocation(result)
										submitSearch(result)
										setResults(null)
									}} 
									key={i}
								>
									{label}
								</li>
							)
						})}
					</ul>
				)}
			</div>
		</div>
	)
}

const styles = css`
  position: absolute;
  z-index: 1000;
  top: 5px;
  left: 50px;
  display: flex;
  flex-flow: row wrap;
  > div {
    margin: 5px;
  }
  .resultContainer {
    flex: 1 0 100%;
  }
  .resultList {
    max-width: 320px;
    list-style: none;
    margin: 0;
    padding: 10px;
    background: #fff;
    border: 1px solid #333;
    border-radius: 5px;
    > li {
      margin-bottom: 10px;
      cursor: pointer;
    }
  }
  .input {
    display: flex;
  }
  .label {
    display: flex;
    background: rgba(0, 0, 0, 0.7);
    justify-content: center;
    align-items: center;
    padding: 0 5px;
    font-size: 14px;
		color: #fff;
  }
  input {
    outline: none;
    padding: 5px 10px;
  }
  button {
    padding: 0 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .checkmark {
    border-right: 2px solid black;
    border-bottom: 2px solid black;
    height: 15px;
    width: 7.5px;
    transform: rotate(45deg);
    margin-bottom: 5px;
  } 
`