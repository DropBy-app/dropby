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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task } from "./data";
import { TaskCard } from "./components/TaskCard";
import { NewTaskForm } from "./components/NewTaskForm";
import { useLocalStorage } from "usehooks-ts";

const exampleTasks: Task[] = [
  {
    id: 1,
    title: "Take a picture of me",
    description: "I want a picture of myself",
    requester: "Alice",
    taskType: "info",
    completed: false,
  },
  {
    id: 2,
    title: "Buy me a coffee",
    description: "I want a coffee",
    requester: "Bob",
    taskType: "task",
    completed: false,
  },
  {
    id: 3,
    title: "Tell me a joke",
    description: "I want to laugh",
    requester: "Charlie",
    taskType: "info",
    completed: false,
  },
  {
    id: 4,
    title: "Fix my computer",
    description: "I need help with my computer",
    requester: "David",
    taskType: "task",
    completed: false,
  },
];

// Mock Convex functions (replace with actual Convex integration)
const mockConvex = {
  mutation: (name: string, data: any) => {
    console.log(`Mutation: ${name}`, data);
    return Promise.resolve({ id: Date.now() });
  },
  query: (name: string) => {
    console.log(`Query: ${name}`);
    return Promise.resolve(exampleTasks);
  },
};

export const App: React.FC = () => {
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
    <div className="h-full overflow-y-auto flex flex-col md:max-w-screen-md md:mx-auto md:p-8 p-4">
      <Tabs
        defaultValue="todo"
        className="w-full flex-grow flex flex-col min-h-0 overscroll-contain"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent
          value="todo"
          className="flex-grow min-h-0 m-4 overflow-y-auto"
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              onDownvote={handleDownvoteTask}
            />
          ))}
        </TabsContent>
        <TabsContent value="completed" className="flex-grow">
          <ScrollArea className="h-full">
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
      <div>
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
