import React, { useState, useEffect } from "react";
import { Task, TaskType } from "@/data";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngLiteral } from "leaflet";
import { LocationMarker } from "./LocationMarker";

const getRandomId = () => Math.floor(Math.random() * 100000);

export const NewTaskForm: React.FC<{
  onSubmit: (taskData: Task) => void;
  onClose: () => void;
}> = ({ onSubmit, onClose }) => {
  const [taskType, setTaskType] = useState<TaskType>("info");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requester, setRequester] = useState("");
  const [location, setLocation] = useState<LatLngLiteral | null>(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("Please select a location");
      return;
    }

    onSubmit({
      taskType,
      title,
      description,
      requester,
      id: getRandomId(),
      completed: false,
      location: `${location.lat},${location.lng}`,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup
        value={taskType}
        onValueChange={(e) => setTaskType(e as TaskType)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="info" id="info" />
          <Label htmlFor="info">Information Request</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="task" id="task" />
          <Label htmlFor="task">Task Request</Label>
        </div>
      </RadioGroup>
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
      {locationError ? (
        <div className="bg-red-200 w-full h-[200px] flex items-center justify-center text-red-600">
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
            height: "200px",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker location={location} setLocation={setLocation} />
        </MapContainer>
      )}
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
