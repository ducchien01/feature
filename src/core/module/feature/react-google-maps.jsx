import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useState } from "react";
import { Text } from "wini-web-components";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
	ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const mapContainerStyle = {
    width: '800px',
    height: '800px',
  }

export default function GgMap() {
  const [open, setOpen] = useState(false);
  //   const [coords, setCoords] = useState({
  //       lat: -3.745,
  //       lng: -38.523,
  //     })
  //   // const [coords, setCoords] = useState({})
  //   const [distance, setDistance] = useState(0);

  // const handleCloseMap = () => {
  //   setOpen(!open);
  // };
  
  // const handleLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       const { latitude, longitude, accuracy } = position.coords;
  //       setCoords({ lat: latitude, lng: longitude });
  //       setDistance(accuracy);
  //     });
  //   }
  // };


    const {isLoaded, loadError } = useLoadScript({
        googleMapsApiKey:"AIzaSyDhSc0v16Cv2aJdlW5tp9Ks8-bI77RQwNk",
        libraries: ["places"],
    })

    // if (loadError) {
    //   return <div>Error loading maps</div>;
    // }
    // if (!isLoaded) {
    //   return <div>Loading maps ...</div>;
    // }
    
    if(!isLoaded) return <div>Loading...</div>

    return  (<Map/>)
        {/* <button className="button-text-3" onClick={handleLocation}>Get Location</button>
        <button className="button-text-3" onClick={handleCloseMap}>Show Map</button>
        {open && (
            <div>
                <button className="button-text-3" onClick={handleCloseMap}>Close Map</button>
                <span>Accuracy {distance} : Metres</span>
                {isLoaded && (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}   
                        center={coords}      
                        zoom={10}           
                    >
                        <Marker position={coords}/>
                    </GoogleMap>
                )}
            </div>
        )} */}
}

function Map() {
  const center = { lat: 21.028333, lng: 105.853333 }
  const [selected, setSelected] = useState(null);
  console.log(selected)
  return (
      <>
          <div className="places-container" style={{width:'1000px', height:'200px'}}> 
            <PlacesAutocomplete setSelected={setSelected}/>
          </div>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}   
            zoom={10}
            center={center}
            // mapContainerClassName="map-container"
          
          >
            {selected && <Marker position={selected}/>}
          </GoogleMap>
      </>
  )
}

function PlacesAutocomplete({ setSelected }) {
  const {
    ready,
    value,
    setValue,
    suggestions: {status, data},
    clearSuggestions
  } = usePlacesAutocomplete();
  
  const handleSelected = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const {lat, lng} = await getLatLng(results[0]);
    setSelected( { lat, lng} );

  }
  return (
    <Combobox onSelect={handleSelected}>
      <ComboboxInput 
        value={value}
        onChange={(e) =>{ setValue(e.target.value)}}
        disabled={!ready}
        // className="combobox-input"
        style={{width:'500px', height:'40px'}}
        placeholder="Search an address"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" && 
            data.map(({ place_id, description }) => (
              <ComboboxOption style={{width:'500px', height:'40px', fontSize:'2.4rem'}} key={place_id} value={description}/>
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  )
}