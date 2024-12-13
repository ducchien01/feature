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
  const [coords, setCoords] = useState<google.maps.LatLngLiteral>()

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setPositionSelected({ lat: latitude, lng: longitude });
      });
    }
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

        <MapHandler place={selectedPlace} />
        <Directions origin={originAddress} destination={destinationAddress}/>
      </APIProvider>
    </div>
  );
};

export default ComponentMap;
