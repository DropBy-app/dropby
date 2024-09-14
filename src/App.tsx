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
