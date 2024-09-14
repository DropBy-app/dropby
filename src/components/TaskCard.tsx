import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/data";
import { Button } from "./ui/button";
import { Check, ThumbsDown } from "lucide-react";

export const TaskCard = ({
  task,
  onComplete,
  onDownvote,
}: {
  task: Task;
  onComplete: (taskId: number) => void;
  onDownvote: (taskId: number) => void;
}) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{task.title}</CardTitle>
      <CardDescription>{task.requester}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="line-clamp-2">{task.description}</p>
    </CardContent>
    <CardFooter className="justify-end space-x-2">
      <Button variant="outline" size="icon" onClick={() => onDownvote(task.id)}>
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => onComplete(task.id)}>
        <Check className="h-4 w-4" />
      </Button>
    </CardFooter>
  </Card>
);
