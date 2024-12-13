import './feature.css'
import React, {useEffect, useState, useCallback, FormEvent} from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
// import gl from "@vis.gl/react-google-maps";
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

export default function MapGl() {
    const position = { lat: 21.028333, lng: 105.853333 }
    // const [open, setOpen] = useState(false);
    // const [coords, setCoords] = useState<any>()
    // const [coords, setCoords] = useState({})
    // const [distance, setDistance] = useState(0);

    // const hanldeLocation = () =>{
    //     if(navigator.geolocation){
    //         console.log("navigator", navigator)
    //         navigator.geolocation.getCurrentPosition((position) => { 
    //             console.log("position", position)
    //             const { latitude, longitude, accuracy } = position.coords;
    //             setCoords({ lat: latitude, lng: longitude });
    //             setDistance(accuracy);
    //         })
    //     }
    // }

    // useEffect(()=>{
    //     if(navigator.geolocation){
    //         navigator.geolocation.getCurrentPosition((position) => { 
    //             const { latitude, longitude, accuracy } = position.coords;
    //             setCoords({ lat: latitude, lng: longitude });
    //             setDistance(accuracy);
    //         })
    //     }
    // },[])

    return (
        // <AutocompleteCustom/>
        <GoogleMapComponent/>
        // <div style={{width: '1000px', height: '1000px'}}>
        //     {/* <button style={{width:'40px', height:'40px', backgroundColor:'red' }} onClick={hanldeLocation}></button> */}
        //     {/* <APIProvider apiKey="AIzaSyDhSc0v16Cv2aJdlW5tp9Ks8-bI77RQwNk">
        //         <Map
        //             defaultCenter={coords}
        //             defaultZoom={10} 
        //             mapId={'d22eb7ad6a03f27b'}
        //         >
        //             <AdvancedMarker position={coords}>
        //                 <Pin background={"gray"} borderColor={"green"} glyphColor={"purple"}/>
        //             </AdvancedMarker>

        //             <AdvancedMarker position={position} onClick={() => { setOpen(true)}}>
        //                 <Pin background={"gray"} borderColor={"green"} glyphColor={"purple"}/>
        //             </AdvancedMarker>
        //              {open && <InfoWindow position={position} onCloseClick={()=>{ setOpen(false) }}><p>I'm Hambug</p></InfoWindow>} 
        //         </Map>
        //     </APIProvider> */}
        //     {/* // routes A to B */}
         

        // </div>
    )
}
 
function GoogleMapComponent() {
    const center = { lat: 21.028333, lng: 105.853333 }
    const [selected, setSelected] = useState(null);
    return (
        <>
            <div className="places-container" style={{width:'1000px', height:'200px'}}> 
              <PlacesAutocomplete setSelected={setSelected}/>
            </div>
           
            <APIProvider apiKey={"AIzaSyDhSc0v16Cv2aJdlW5tp9Ks8-bI77RQwNk"}>
                <Map
                    defaultCenter={center}
                    defaultZoom={10} 
                    mapId={'d22eb7ad6a03f27b'}
                    fullscreenControl={false}
                >
                     {selected && <AdvancedMarker position={selected}/>}
                </Map>
            </APIProvider>
        </>
    )
}

// input search
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

// routes A to B
function Directions() {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionService, setDirectionsSecvice] = useState<google.maps.DirectionsService>()
    const [directionRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>()
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([])
    const [routeIndex, setRouteIndex] = useState(0)
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    useEffect(() =>{
        if(!routesLibrary || !map) return;
        setDirectionsSecvice(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));

    }, [routesLibrary, map])

    useEffect(() =>{
        if (!directionRenderer || !directionService) return;
        directionService.route({
            origin: "Phu Dien",
            destination: "Hồ Ba Góc",
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,  
        }).then(response => {
           directionRenderer.setDirections(response);
           setRoutes(response.routes);
        })
    }, [directionRenderer, directionService])

    useEffect(()=>{
        if (!directionRenderer) return;

        directionRenderer?.setRouteIndex(routeIndex);
    }, [routeIndex, directionRenderer])

    console.log(routes)

    if(!leg) return null;

    return (
        <div className="directions">
            <h2>{selected.summary}</h2>
            <p>{leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}</p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Duration: {leg.duration?.text}</p>
            <h2>Other Routes</h2>
            <ul>
                {routes.map((route, index)=> (
                    <li key={route.summary}>
                        <button onClick={() => {setRouteIndex(index)}}>
                            {route.summary}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}


interface Props {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const AutocompleteCustom = ({onPlaceSelect}: Props) => {
    const map = useMap();
    const places = useMapsLibrary('places');

    const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken>();
    const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
    const [predictionResults, setPredictionResults] = useState<Array<google.maps.places.AutocompletePrediction>>([]);
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(()=>{
        if (!places || !map) return;
        setAutocompleteService(new places.AutocompleteService());
        setPlacesService(new places.PlacesService(map));
        setSessionToken(new places.AutocompleteSessionToken());

        return () => setAutocompleteService(null);
    },[map, places])

    const fetchPredictions = useCallback(
        async (inputValue: string) => {
          if (!autocompleteService || !inputValue) {
            setPredictionResults([]);
            return;
          }
    
          const request = {input: inputValue, sessionToken};
          const response = await autocompleteService.getPlacePredictions(request);
    
          setPredictionResults(response.predictions);
        },
        [autocompleteService, sessionToken]
    );
    
    const onInputChange = useCallback(
        (event: FormEvent<HTMLInputElement>) => {
          const value = (event.target as HTMLInputElement)?.value;
    
          setInputValue(value);
          fetchPredictions(value);
        },
        [fetchPredictions]
    );

    const handleSuggestionClick = useCallback(
        (placeId: string) => {
          if (!places) return;
    
          const detailRequestOptions = {
            placeId,
            fields: ['geometry', 'name', 'formatted_address'],
            sessionToken
          };
    
          const detailsRequestCallback = (
            placeDetails: google.maps.places.PlaceResult | null
          ) => {
            onPlaceSelect(placeDetails);
            setPredictionResults([]);
            setInputValue(placeDetails?.formatted_address ?? '');
            setSessionToken(new places.AutocompleteSessionToken());
          };
    
          placesService?.getDetails(detailRequestOptions, detailsRequestCallback);
        },
        [onPlaceSelect, places, placesService, sessionToken]
    );

    return (
        <div className="autocomplete-container">
        <input
          value={inputValue}
          onInput={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
          placeholder="Search for a place"
        />
  
        {predictionResults.length > 0 && (
          <ul className="custom-list">
            {predictionResults.map(({place_id, description}) => {
              return (
                <li
                  key={place_id}
                  className="custom-list-item"
                  onClick={() => handleSuggestionClick(place_id)}>
                  {description}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    )
}