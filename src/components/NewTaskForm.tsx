import React, { useState, useEffect } from "react";
import { ClientTask } from "@/data";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngLiteral } from "leaflet";
import { LocationMarker } from "./LocationMarker";
import { useLocalStorage } from "usehooks-ts";
import { useGeolocation } from "@uidotdev/usehooks";
import { estimateTimeAndSize, generateTitle } from "@/ai";

export const NewTaskForm: React.FC<{
  onSubmit: (taskData: ClientTask) => void;
  onClose: () => void;
}> = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requester, setRequester] = useLocalStorage("username", "");
  const [location, setLocation] = useState<LatLngLiteral | null>(null);
  const userGeoLocation = useGeolocation();
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              setLocationError(null);
            },
            (error) => {
              console.error("Error getting location:", error);
              setLocationError("Error getting location");
            }
          );
        } else if (result.state === "prompt") {
          setLocationError("Please grant location permission");
        } else if (result.state === "denied") {
          setLocationError("Location permission denied");
        }

        result.onchange = () => {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setLocation({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
                setLocationError(null);
              },
              (error) => {
                console.error("Error getting location:", error);
                setLocationError("Error getting location");
              }
            );
          } else if (result.state === "denied") {
            setLocationError("Location permission denied");
          }
        };
      });
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }
  }, []);

  useEffect(() => {
    if (userGeoLocation.latitude && userGeoLocation.longitude) {
      setLocation({
        lat: userGeoLocation.latitude,
        lng: userGeoLocation.longitude,
      });
    }
  }, [userGeoLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("Please select a location");
      return;
    }

    const title = await generateTitle(description);
    const timeAndSize = await estimateTimeAndSize(description);
    console.log("title", title, "timeAndSize", timeAndSize);

    onSubmit({
      title,
      description,
      requester,
      completed: false,
      location: `${location.lat},${location.lng}`,
      timeEstimate: timeAndSize.time,
      sizeEstimate: timeAndSize.size,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Input
        placeholder="Your Name"
        value={requester}
        onChange={(e) => setRequester(e.target.value)}
        required
      />
      <div className="w-full h-[200px] rounded overflow-hidden">
        {locationError ? (
          <div className="bg-red-200  flex items-center justify-center text-red-600">
            {locationError}
          </div>
        ) : (
          <MapContainer
            center={[43.47209774864078, -80.54050653819894]}
            zoom={13}
            scrollWheelZoom={false}
            attributionControl={false}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker location={location} setLocation={setLocation} />
          </MapContainer>
        )}
      </div>
      {location && (
        <p className="text-sm text-gray-500">
          Selected location: {location.lat.toFixed(6)},{" "}
          {location.lng.toFixed(6)}
        </p>
      )}
      <Button type="submit" disabled={!location}>
        Create Task
      </Button>
    </form>
  );
};
