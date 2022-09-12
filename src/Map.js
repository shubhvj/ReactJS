import React from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { showDataOnMap } from './util'
import './Map.css'

function ChangeMapView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function Map({ countries, casesType, center, zoom }) {
  return (
    <div className='map'>
      
      <MapContainer center={center} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeMapView center={center} zoom={zoom} />
        {showDataOnMap(countries, casesType)}
      </MapContainer>
    </div>
  )
}

export default Map