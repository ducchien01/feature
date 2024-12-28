import React, {useEffect, useState, useCallback, FormEvent} from 'react';
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import { Select1Form } from '../../../component/form';
import { randomGID } from '../../../common/Utils';
import { useForm } from 'react-hook-form';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

// This is a custom built autocomplete component using the "Autocomplete Service" for predictions
// and the "Places Service" for place details
export const AutocompleteCustom = ({onPlaceSelect}: Props) => {
  const map = useMap();
  const places = useMapsLibrary('places');
  const methods = useForm({ shouldFocusError: false, defaultValues: { Id: randomGID(), Form: { Required: true } } })

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
          <Select1Form
                required
                style={{ flex: 1 }}
                label={'TablePK'}
                control={methods.control as any}
                errors={methods.formState.errors}
                name={'TablePK'}
                options={predictionResults.map(({place_id, description}) => {
                  console.log(place_id, description)
                    return {
                        id: place_id,
                        name: description,
                    }
                })}
                onChange={(v) => { }}
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
  );
};
// function useForm(arg0: { shouldFocusError: boolean; defaultValues: { Id: any; Form: { Required: boolean; }; }; }) {
//   throw new Error('Function not implemented.');
// }

