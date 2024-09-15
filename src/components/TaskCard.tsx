import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { useGeolocation } from "@uidotdev/usehooks";
import { Button } from "./ui/button";
import { Check, Maximize2, ThumbsDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/data";
import { MapContainer, TileLayer } from "react-leaflet";
import { LocationMarker } from "./LocationMarker";
import { LatLngLiteral } from "leaflet";
import { cn, timeAgo } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export interface CompletionData {
  notes: string;
}

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string, completionData: CompletionData) => void;
  onDownvote: (taskId: string) => void;
  completed?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onComplete,
  onDownvote,
  completed = false,
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownvoteModalOpen, setIsDownvoteModalOpen] = useState(false);

  const [completionNotes, setCompletionNotes] = useState("");
  const [downvoteReason, setDownvoteReason] = useState("");
  const locationState = useGeolocation();
  const distance = useMemo(() => {
    if (!task.location) return null;
    if (locationState.loading) return null;
    if (!locationState.longitude || !locationState.latitude) return null;

    const [lat, lng] = task.location.split(",").map(parseFloat);
    const distance = Math.sqrt(
      (locationState.latitude - lat) ** 2 + (locationState.longitude - lng) ** 2
    );
    const distanceKm = distance * 111.32;
    return distanceKm;
  }, [
    task.location,
    locationState.loading,
    locationState.longitude,
    locationState.latitude,
  ]);

  const location: LatLngLiteral | null = (() => {
    if (!task.location) return null;
    const [lat, lng] = task.location.split(",").map(parseFloat);
    return { lat, lng };
  })();

  const handleComplete = () => {
    onComplete(task._id, { notes: completionNotes });
    setIsModalOpen(false);
    setCompletionNotes("");
  };

  return (
    <>
      <Card className="mb-4 md:h-[200px] flex bg-card/50 backdrop-blur">
        <div className="min-w-0 grow h-full flex flex-col p-6 pr-4 pb-4">
          <div className="flex flex-col gap-y-1.5 select-none ">
            <div className="text-2xl font-semibold leading-none tracking-tight">
              {task.title}
            </div>
            <div className="text-sm text-muted-foreground">
              {task.requester}
            </div>
          </div>
          <p className="line-clamp-2 select-none">{task.description}</p>
          <div className="flex items-end justify-end space-x-2 self-end grow w-full">
            <div className="flex flex-col text-sm text-muted-foreground select-none">
              {distance && <div>{distance.toFixed(2)} km away</div>}
              <div>{timeAgo.format(task._creationTime)}</div>
            </div>
            <div className="grow"></div>
            {!completed && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-background/30 hover:bg-accent/30 backdrop-blur"
                        onClick={() => setIsDetailsModalOpen(true)}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View more details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-background/30 hover:bg-accent/30 backdrop-blur"
                        onClick={() => setIsDownvoteModalOpen(true)}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Downvote and dismiss</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-background/30 hover:bg-accent/30 backdrop-blur"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Complete Task</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </div>
        <div className="md:w-[200px] md:h-[200px] w-[100px] rounded-lg overflow-hidden cursor-pointer shrink-0">
          <MapContainer
            center={[location?.lat || 0, location?.lng || 0]}
            zoom={13}
            scrollWheelZoom={false}
            attributionControl={false}
            dragging={false}
            zoomControl={false}
            touchZoom={false}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              location={location}
              setLocation={() => {}}
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${location?.lat},${location?.lng}`,
                  "_blank"
                );
              }}
            />
          </MapContainer>
        </div>
      </Card>
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="p-0">
          <div>
            <div className="bg-muted p-4 sm:rounded-lg">
              <h1 className="text-2xl font-bold">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={cn("inline-block w-4 h-4 rounded-full", {
                          " bg-green-500": !task.completed,
                          " bg-gray-500": task.completed,
                        })}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{task.completed ? "Completed" : "Open"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>{" "}
                {task.title}
              </h1>
              <p className="text-lg">{task.description}</p>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Requested by:</span>{" "}
                  {task.requester}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Location:</span>{" "}
                  {task.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Created:</span>{" "}
                  {timeAgo.format(task._creationTime)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Distance:</span>{" "}
                  {distance?.toFixed(2)} km
                </p>
              </div>
              <div className="w-full h-[200px] rounded overflow-hidden cursor-pointer shrink-0">
                <MapContainer
                  center={[location?.lat || 0, location?.lng || 0]}
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
                  <LocationMarker
                    location={location}
                    setLocation={() => {}}
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${location?.lat},${location?.lng}`,
                        "_blank"
                      );
                    }}
                  />
                </MapContainer>
              </div>
            </div>
          </div>
          <DialogFooter className="p-4 pt-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!completionNotes}
              onClick={() => {
                handleComplete();
                toast(`Task completed successfully! Thanks you for your help.`);
              }}
            >
              Complete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDownvoteModalOpen} onOpenChange={setIsDownvoteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Downvoting and Dismissing Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="completion-notes" className="col-span-4">
                Why did you downvote this task?
              </Label>
              <RadioGroup
                className="col-span-4 space-y-2"
                value={downvoteReason}
                onValueChange={(e) => setDownvoteReason(e as string)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="info" value="info" />
                  <Label className="select-none" htmlFor="info">
                    Inappropriate request
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="task" value="task" />
                  <Label className="select-none" htmlFor="task">
                    Task too far
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="other" value="other" />
                  <Label className="select-none" htmlFor="other">
                    Task too complex
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDownvoteModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={!downvoteReason}
              onClick={() => {
                toast(
                  "Thank you. We will adjust your task preference accordingly."
                );
                onDownvote(task._id);
              }}
            >
              Downvote and Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
