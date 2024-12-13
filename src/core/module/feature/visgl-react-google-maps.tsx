import {useEffect, useMemo, useState} from "react";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";


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
        <div style={{width: '1000px', height: '1000px'}}>
            {/* <button style={{width:'40px', height:'40px', backgroundColor:'red' }} onClick={hanldeLocation}></button> */}
            {/* <APIProvider apiKey="AIzaSyDhSc0v16Cv2aJdlW5tp9Ks8-bI77RQwNk">
                <Map
                    defaultCenter={coords}
                    defaultZoom={10} 
                    mapId={'d22eb7ad6a03f27b'}
                >
                    <AdvancedMarker position={coords}>
                        <Pin background={"gray"} borderColor={"green"} glyphColor={"purple"}/>
                    </AdvancedMarker>

                    <AdvancedMarker position={position} onClick={() => { setOpen(true)}}>
                        <Pin background={"gray"} borderColor={"green"} glyphColor={"purple"}/>
                    </AdvancedMarker>
                     {open && <InfoWindow position={position} onCloseClick={()=>{ setOpen(false) }}><p>I'm Hambug</p></InfoWindow>} 
                </Map>
            </APIProvider> */}
            {/* // routes A to B */}
            {/* <APIProvider apiKey={"AIzaSyDhSc0v16Cv2aJdlW5tp9Ks8-bI77RQwNk"}>
                <Map
                    defaultCenter={position}
                    defaultZoom={10} 
                    mapId={'d22eb7ad6a03f27b'}
                    fullscreenControl={false}
                >
                    <Directions/>
                </Map>
            </APIProvider> */}

        </div>
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
