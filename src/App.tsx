import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsDown, Check } from "lucide-react";

const getRandomId = () => Math.floor(Math.random() * 100000);

// Mock Convex functions (replace with actual Convex integration)
const mockConvex = {
  mutation: (name: string, data: any) => {
    console.log(`Mutation: ${name}`, data);
    return Promise.resolve({ id: Date.now() });
  },
  query: (name: string) => {
    console.log(`Query: ${name}`);
    return Promise.resolve([]);
  },
};

interface Task {
  id: number;
  title: string;
  description: string;
  requester: string;
  taskType: TaskType;
}

const TaskCard = ({
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

type TaskType = "info" | "task";

const NewTaskForm = ({
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

const DropbyDemo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  useEffect(() => {
    // Fetch initial tasks (replace with actual Convex query)
    mockConvex.query("getTasks").then(setTasks);
    mockConvex.query("getCompletedTasks").then(setCompletedTasks);
  }, []);

  const handleNewTask = (taskData: Task) => {
    mockConvex.mutation("createTask", taskData).then((newTask) => {
      setTasks([...tasks, { ...taskData, id: newTask.id }]);
    });
  };

  const handleCompleteTask = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      mockConvex.mutation("completeTask", { taskId }).then(() => {
        setTasks(tasks.filter((t) => t.id !== taskId));
        setCompletedTasks([...completedTasks, task]);
      });
    }
  };

  const handleDownvoteTask = (taskId: number) => {
    mockConvex.mutation("downvoteTask", { taskId }).then(() => {
      setTasks(tasks.filter((t) => t.id !== taskId));
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <Tabs defaultValue="todo" className="w-full flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="todo" className="flex-grow">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onDownvote={handleDownvoteTask}
              />
            ))}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="completed" className="flex-grow">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => {}}
                onDownvote={() => {}}
              />
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <div className="p-4">
        <Dialog open={isNewTaskModalOpen} onOpenChange={setIsNewTaskModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <NewTaskForm
              onSubmit={handleNewTask}
              onClose={() => setIsNewTaskModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DropbyDemo;
