import React, {useEffect, useState} from 'react';

import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
  MapControl,
  ControlPosition
} from '@vis.gl/react-google-maps';


interface Props {
    origin: string;
    destination: string;
  }

export const Directions = ({origin, destination}: Props ) => {
    console.log("direction", origin, destination)
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] =
      useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] =
      useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];
  
    // Initialize directions service and renderer
    useEffect(() => {
      if (!routesLibrary || !map) return;
      setDirectionsService(new routesLibrary.DirectionsService());
      setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
    }, [routesLibrary, map]);
  
    // Use directions service
    useEffect(() => {
      if (!directionsService || !directionsRenderer || !origin || !destination) return;
  
      directionsService
        .route({
          origin: origin ?? "Phú Diễn, Bắc Từ Liêm, Hà Nội, Vietnam",
          destination: destination?? "Hồ Ba Góc, Phố Yên, Tiền Phong, Mê Linh, Hà Nội, Vietnam",
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true
        })
        .then(response => {
          directionsRenderer.setDirections(response);
          setRoutes(response.routes);
        });
  
      return () => directionsRenderer.setMap(null);
    }, [directionsService, directionsRenderer, origin, destination]);
  
    // Update direction route
    useEffect(() => {
      if (!directionsRenderer) return;
      directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);
  
    if (!leg) return null;
  
    return (
        <MapControl position={ControlPosition.TOP_RIGHT}>
            <div className="directions">
                <h2>{selected.summary}</h2>
                <p>
                {leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}
                </p>
                <p>Distance: {leg.distance?.text}</p>
                <p>Duration: {leg.duration?.text}</p>
        
                <h2>Other Routes</h2>
                <ul>
                {routes.map((route, index) => (
                    <li key={route.summary}>
                    <button onClick={() => setRouteIndex(index)}>
                        {route.summary}
                    </button>
                    </li>
                ))}
                </ul>
            </div>
        </MapControl>
      
    );
  }