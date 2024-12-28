import React, {useEffect, useState, useCallback, FormEvent} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import { TextField, Winicon } from 'wini-web-components';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  // place
  handlePositionSelected?: any;
  handlePlaceName?: any
}

// This is a custom built autocomplete component using the "Autocomplete Service" for predictions
// and the "Places Service" for place details
export const AutocompleteCustom = ({onPlaceSelect, handlePositionSelected, handlePlaceName}: Props) => {
  const map = useMap();
  const places = useMapsLibrary('places');

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteSessionToken
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken>();

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);

  // https://developers.google.com/maps/documentation/javascript/reference/places-service
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

  const [predictionResults, setPredictionResults] = useState<Array<google.maps.places.AutocompletePrediction>>([]);

  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    if (!places || !map) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());

    return () => setAutocompleteService(null);
  }, [map, places]);

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
        handlePlaceName(placeDetails?.formatted_address);
        setSessionToken(new places.AutocompleteSessionToken());
      };

      placesService?.getDetails(detailRequestOptions, detailsRequestCallback);
    },
    [onPlaceSelect, places, placesService, sessionToken]
  );

  const handleGetLoaction = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      handlePositionSelected({ lat: latitude, lng: longitude });
      map?.panTo({ lat: latitude, lng: longitude })
      map?.setZoom(15)
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
        if (status === "OK" && results && results.length > 0) {
          handlePlaceName(results[0].formatted_address); // Lấy tên địa điểm từ kết quả
        } else {
          console.error("Geocoder failed due to: " + status);
          handlePlaceName("Không thể lấy tên địa điểm");
        }
      });
    });
  }

  return (
    <div className="autocomplete-container">
      <TextField
        value={inputValue}
        style={{ width: "100%" }}
        prefix={<Winicon src={"fill/development/zoom"} size={"1.4rem"} />}
        suffix={<Winicon src={"outline/location/compass-3"} size={"1.4rem"} color={"var(--primary-main-color)"} onClick={handleGetLoaction} style={{ cursor: 'pointer' }} />}
        className={`placeholder-2`}
        placeholder={'Tìm kiếm'}
        onChange={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
      />
      {predictionResults.length > 0 && (
        <ul className="custom-list">
          {predictionResults.map(({ place_id, description }) => {
            return (
              <li
                key={place_id}
                // style={{ padding: '1rem', fontSize: '1.2rem', height:'3rem'}}
                className={"custom-list-item"}
                onClick={() => handleSuggestionClick(place_id)}>
                {description}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
