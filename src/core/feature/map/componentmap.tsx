import React, {useEffect, useState} from 'react';
// import {createRoot} from 'react-dom/client';
import {APIProvider, ControlPosition, Map, MapControl, AdvancedMarker} from '@vis.gl/react-google-maps';

// import ControlPanel from './control-panel';
import {CustomMapControl} from './map-control';
import MapHandler from './map-handler';
import { Directions } from './direction';
import { Select1, TextField } from 'wini-web-components';
import { useForm } from "react-hook-form";
import { AutocompleteCustom } from './autocomplete-custom';

const API_KEY = "AIzaSyDhSc0v16Cv2aJdlW5tp9Ks8-bI77RQwNk"
 

export type AutocompleteMode = {id: string; label: string};

const autocompleteModes: Array<AutocompleteMode> = [
  {id: 'classic', label: 'Google Autocomplete Widget'},
  {id: 'custom', label: 'Custom Build'},
  {id: 'custom-hybrid', label: 'Custom w/ Select Widget'}
];

const ComponentMap = () => {
  const center = { lat: 21.028333, lng: 105.853333 };
  const [selectedAutocompleteMode, setSelectedAutocompleteMode] = useState<AutocompleteMode>(autocompleteModes[0]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [positionSelected, setPositionSelected] = useState<google.maps.LatLngLiteral | undefined>();
  const [origin, setOrigin] = useState<google.maps.places.PlaceResult | null>(null);
  const [destination, setDestination] = useState<google.maps.places.PlaceResult | null>(null);
  const [originAddress, setOriginAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  // const [coords, setCoords] = useState<google.maps.LatLngLiteral>()
  const [placeName, setPlaceName] = useState<string | null>(null);

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setPositionSelected({ lat: latitude, lng: longitude });
      });
    }
  };

  const handleClick = (e: any) => {
    setPositionSelected(e.detail.latLng);
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: e.detail.latLng }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        setPlaceName(results[0].formatted_address); // Lấy tên địa điểm từ kết quả
      } else {
        console.error("Geocoder failed due to: " + status);
        setPlaceName("Không thể lấy tên địa điểm");
      }
    });
  };


  useEffect(()=>{
    if (!selectedPlace || !center ) return;

    if(selectedPlace?.geometry?.location) {
      const location = selectedPlace.geometry.location;
      const latLngLiteral = { lat: location.lat(), lng: location.lng() };
      setPositionSelected(latLngLiteral); // Cập nhật tọa độ vào state center
    }
  },[selectedPlace])

  useEffect(()=>{
    if (!origin || !destination ) return;

    if(origin?.formatted_address) {
      setOriginAddress(origin?.formatted_address); // Cập nhật tọa độ vào state center
    }
    
    if(destination?.formatted_address) {
      setDestinationAddress(destination?.formatted_address); // Cập nhật tọa độ vào state center
    }
  },[origin, destination])

  
console.log(positionSelected)

  return (
    <div style={{width: '600px', height: '400px'}}>
      <APIProvider apiKey={API_KEY}>
        <div className='row'>
          <h3>Origin</h3>
          <AutocompleteCustom onPlaceSelect={setOrigin} />
          <h3>Destination</h3>
          <AutocompleteCustom onPlaceSelect={setDestination} />
          <button style={{width:'60px', height:'30px'}} onClick={handleLocation}>Get Location</button>
        </div>  
        <Map
          defaultZoom={7}
          defaultCenter={center}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          onClick={handleClick}
          mapId={'d22eb7ad6a03f27b'}
        >
          <AdvancedMarker position={positionSelected}/>
        </Map>
  
        <CustomMapControl
          controlPosition={ControlPosition.TOP}
          selectedAutocompleteMode={selectedAutocompleteMode}
          onPlaceSelect={setSelectedPlace}
        />

        {/* <ControlPanel
          autocompleteModes={autocompleteModes}
          selectedAutocompleteMode={selectedAutocompleteMode}
          onAutocompleteModeChange={setSelectedAutocompleteMode}
        /> */}

        <MapControl position={ControlPosition.TOP_CENTER} />

        <MapControl position={ControlPosition.BOTTOM_CENTER}>
          {positionSelected &&
            <div className='col' style={{ marginBottom: '2rem', background: "#fff", padding: "10px", borderRadius: "5px", fontSize: '1.2rem' }}>
              <div style={{ color: "var(--neutral-text-title-color)", fontSize: '1.2rem' }}>{placeName ?? "Không có địa điểm nào"}</div>
              <div><span style={{ color: "var(--primary-main-color)", fontSize: '0.8rem' }}>{positionSelected?.lat.toFixed(6)}</span>, <span style={{ color: "var(--primary-main-color)", fontSize: '1rem' }}>{positionSelected?.lng.toFixed(6)}</span></div>
            </div>
          }
        </MapControl>

        <MapHandler place={selectedPlace} />
        
        <AutocompleteCustom onPlaceSelect={setSelectedPlace} handlePositionSelected={setPositionSelected} handlePlaceName={setPlaceName} />
        
        <Directions origin={originAddress} destination={destinationAddress}/>
      </APIProvider>
    </div>
  );
};

export default ComponentMap;
