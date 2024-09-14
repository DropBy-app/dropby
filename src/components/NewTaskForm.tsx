import { Task, TaskType } from "@/data";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

const getRandomId = () => Math.floor(Math.random() * 100000);

export const NewTaskForm = ({
  onSubmit,
  onClose,
}: {
  onSubmit: (taskData: Task) => void;
  onClose: () => void;
}) => {
  const [taskType, setTaskType] = useState<TaskType>("info");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requester, setRequester] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ taskType, title, description, requester, id: getRandomId() });
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
      <Button type="submit">Create Task</Button>
    </form>
  );
};
