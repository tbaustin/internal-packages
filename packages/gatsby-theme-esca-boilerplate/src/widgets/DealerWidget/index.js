import React, { useState, useRef, useEffect } from 'react'
import { css, Global } from '@emotion/core'
import { useStaticQuery, graphql } from 'gatsby'

import 'leaflet-geosearch/assets/css/leaflet.css'
import 'leaflet/dist/leaflet.css'
import 'react-leaflet-markercluster/dist/styles.min.css'

import Search from './Search'
import getDealers from './getDealers'

const dealerQuery = graphql`{
  allDealers(filter: {latitude: {ne: null}, longitude: {ne: null}}) {
    nodes {
      latitude
      longitude
      name
    }
  }
}`

function DealerWidget(props){
	const { proximitySearch } = props
	const mapEl = useRef(null)
	const [leaflet, setLeaflet] = useState({})
	const [visibleLocations, setVisibleLocations] = useState([])
	const [proxMarkers, setProxMarkers] = useState(null)
	const [loadingUser, setLoadingUser] = useState(proximitySearch)
	const { allDealers: { nodes: markers } } = useStaticQuery(dealerQuery)

	const {
		Map,
		TileLayer,
		Marker,
		Popup,
		MarkerClusterGroup,
		icon,
		latLngBounds,
		initBounds,
		useLeaflet,
		OpenStreetMapProvider,
		leaf,
	} = leaflet

	useEffect(() => {
		// Dynamically import leaflet due to window in src
		!async function init() {
			if (!leaflet.Map) {
				const L = await import(`leaflet`)
				const icon = L.divIcon({className: `markerIcon`})

				const {
					Map,
					TileLayer,
					Marker,
					Popup,
					useLeaflet,
				} = await import(`react-leaflet`)

				const {
					default: MarkerClusterGroup,
				} = await import(`react-leaflet-markercluster`)

				const { OpenStreetMapProvider } = await import(`leaflet-geosearch`)

				const initBounds = L.latLngBounds()
				markers.forEach(m => {
					const { latitude, longitude } = m
					initBounds.extend([latitude, longitude])
				})

				setLeaflet({
					Map,
					TileLayer,
					Marker,
					Popup,
					MarkerClusterGroup,
					icon,
					latLngBounds: L.latLngBounds,
					initBounds,
					useLeaflet,
					OpenStreetMapProvider,
					leaf: L,
				})
			}
		}()

		// Wait for map ref to be available and update
		const interval = setInterval(() => {
			if(!mapEl.current) return
			clearInterval(interval)
			handleMove()
		}, 10)
	}, [])

	useEffect(() => {
		if(mapEl?.current?.leafletElement){
			if(latLngBounds && proxMarkers){
				const bounds = latLngBounds()
				proxMarkers.forEach(m => {
					const { latitude, longitude } = m
					bounds.extend([latitude, longitude])
				})
				if(proximitySearch) setLoadingUser(false)

				mapEl?.current?.leafletElement?.flyToBounds?.(bounds)
			} 
		}
	}, [proxMarkers])

	const handleMove = () => {
		const locations = []
		if(mapEl?.current){
			const mapBounds = mapEl?.current?.leafletElement?.getBounds()
			const dealers = proximitySearch ? proxMarkers || [] : markers
      
			dealers.forEach(marker => {
				const { latitude, longitude } = marker
				if(mapBounds?.contains([latitude, longitude])){
					locations.push(marker)
				}
			})
		}
    
		setVisibleLocations(locations)
	}

	const handleSearch = async (location, radius = 30) => {
		if(location){
			const { raw: { address }, bounds } = location 
			const { state, city } = address

			if(proximitySearch){ 
				const dealers = await getDealers(city, state, radius)
				const allDealers = [...dealers.local || [], ...dealers.retail || []]
				setProxMarkers(allDealers)
			} else {
				mapEl?.current?.leafletElement?.flyToBounds?.(bounds)
			}
		}
	} 

	const locations = proximitySearch ? proxMarkers : markers

	if(!Map) {
		return (
			<div className="loading">Loading...</div>
		)
	}

	return (
		<>
			<Global 
				styles={styles.global}
			/>
			<div css={styles.mapContainer}>
				<div className="locationList">
					{visibleLocations.length} dealers in the window
				</div>
				<Map
					bounds={initBounds}
					maxZoom={30}
					css={styles.map}
					onMoveend={handleMove}
					ref={mapEl}
				>
					<TileLayer 
						attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>
					<Search
						onSearch={handleSearch}
						proximitySearch={proximitySearch}
						useLeaflet={useLeaflet}
						OpenStreetMapProvider={OpenStreetMapProvider}
						loadingUser={loadingUser}
						leaf={leaf}
					/>
					{locations && (
						<MarkerClusterGroup>
							{locations.map((m, i) => {
								const { latitude, longitude, name } = m
								return (
									<Marker key={i} icon={icon} position={[latitude, longitude]}>
										<Popup>
											<div>{name}</div>
										</Popup>
									</Marker>
								)
							})}
						</MarkerClusterGroup>
					)}
				</Map>
			</div>
		</>
	)
}

export default DealerWidget

const styles = {
	global: css`
    body {
      margin: 0;
    } 
	`,
	map: css`
    height: 100vh;
		width: 100%;
		.leaflet-control-container {
			user-select: none;
    }
    .markerIcon {
      background: blue;
      border-radius: 50%;
    }
	`,
	mapContainer: css`
		max-width: 1000px;
		width: 100%;
		margin: 0 auto;
		z-index: 0;
		display: flex;
	`,
}