import { LatLngLiteral, LocationEvent } from "leaflet";
import { useEffect } from "react";
import { Marker, useMap } from "react-leaflet";

export function LocationMarker({
  location,
  setLocation,
}: {
  location: LatLngLiteral | null;
  setLocation: React.Dispatch<React.SetStateAction<LatLngLiteral | null>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView(location, map.getZoom());
    }
  }, [location, map]);

  useEffect(() => {
    map.locate().on("locationfound", function (e: LocationEvent) {
      setLocation(e.latlng);
      map.setView(e.latlng, map.getZoom());
    });
  }, [map, setLocation]);

  return location === null ? null : <Marker position={location} />;
}
