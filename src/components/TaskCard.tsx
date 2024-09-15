import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Check, ThumbsDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/data";
import { MapContainer, TileLayer } from "react-leaflet";
import { LocationMarker } from "./LocationMarker";
import { LatLngLiteral } from "leaflet";

export interface CompletionData {
  notes: string;
}

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number, completionData: CompletionData) => void;
  onDownvote: (taskId: number) => void;
  completed?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onDownvote,
  completed = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const location: LatLngLiteral | null = (() => {
    if (!task.location) return null;
    const [lat, lng] = task.location.split(",").map(parseFloat);
    console.log("lat", lat, "lng", lng, "task.location", task.location);
    return { lat, lng };
  })();

  const handleComplete = () => {
    onComplete(task.id, { notes: completionNotes });
    handleCloseModal();
    setCompletionNotes("");
  };

  return (
    <>
      <Card className="mb-4 h-[200px]">
        <div className="flex">
          <div className="min-w-0 grow">
            <CardHeader className="select-none">
              <CardTitle>{task.title}</CardTitle>
              <CardDescription>{task.requester}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2">{task.description}</p>
            </CardContent>
            {!completed && (
              <CardFooter className="justify-end space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDownvote(task.id)}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleOpenModal}>
                  <Check className="h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </div>
          <div
            className="w-[200px] h-[200px] rounded-lg overflow-hidden cursor-pointer"
            onClick={() => {
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${location?.lat},${location?.lng}`,
                "_blank"
              );
            }}
          >
            <MapContainer
              center={[43.47209774864078, -80.54050653819894]}
              zoom={13}
              scrollWheelZoom={false}
              attributionControl={false}
              dragging={false}
              zoomControl={false}
              touchZoom={false}
              style={{
                width: "200px",
                height: "200px",
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker location={location} setLocation={() => {}} />
            </MapContainer>
          </div>
        </div>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="completion-notes" className="col-span-4">
                Completion Notes
              </Label>
              <Textarea
                id="completion-notes"
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                className="col-span-4"
                placeholder="Enter any additional information or notes about completing the task"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button onClick={handleComplete}>Complete Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
