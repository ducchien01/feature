import './map.css'
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {APIProvider, ControlPosition, Map, MapControl, AdvancedMarker, useMap} from '@vis.gl/react-google-maps';
import MapHandler from '../feature/map/map-handler';
import { AutocompleteCustom } from '../test/customAutocomplete';
import { debounce } from 'lodash';

const API_KEY = "AIzaSyDhSc0v16Cv2aJdlW5tp9Ks8-bI77RQwNk"

export type AutocompleteMode = {id: string; label: string};

const GGMap = () => {
  const center = { lat: 21.028333, lng: 105.853333 };
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [positionSelected, setPositionSelected] = useState<google.maps.LatLngLiteral | undefined>();
  const [pin, setPin] = useState<boolean>(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setPositionSelected({ lat: latitude, lng: longitude });
      });
    }
  };
   const handleChange = (e: any) => {
    setPositionSelected(e.detail.center);
  };

  const handleClick = (e: any) => {
    setPositionSelected(e.detail.latLng);
  };

  useEffect(()=>{
    if (!selectedPlace || !center ) return;

    if(selectedPlace?.geometry?.location) {
      const location = selectedPlace.geometry.location;
      const latLngLiteral = { lat: location.lat(), lng: location.lng() };
      setPositionSelected(latLngLiteral); // Cập nhật tọa độ vào state center
    }
  },[selectedPlace])

  return (
    <div style={{width: '600px', height: '400px'}}>
      <APIProvider apiKey={API_KEY}>
        <div className='row'>
          <button style={{width:'60px', height:'30px'}} onClick={handleLocation}>Get Location</button>
          <button style={{width:'60px', height:'30px'}} onClick={() =>{ setPin(!pin) }}>Pin Location</button>
        </div>  
        <Map
          defaultZoom={7}
          defaultCenter={center}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          // onCenterChanged={pin ? handleChange : undefined}
          onClick={handleClick}
          // onDragend={handleChange}
          mapId={'d22eb7ad6a03f27b'}
        >
            <AdvancedMarker position={positionSelected} className="advanced-marker" />

        </Map>

        <MapControl position={ControlPosition.TOP_CENTER}>     
          <AutocompleteCustom onPlaceSelect={setSelectedPlace} />
        </MapControl>

        <MapControl position={ControlPosition.BLOCK_END_INLINE_CENTER}>     
            <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "#fff", padding: "10px", borderRadius: "5px" }}>
              <div>Tọa độ trung tâm:</div>
              <div>Lat: {positionSelected?.lat}</div>
              <div>Lng: {positionSelected?.lng}</div>
            </div>
        </MapControl>

        <MapHandler place={selectedPlace} />
      </APIProvider>
    </div>
  );
};

export default GGMap;
