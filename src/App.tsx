import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Task } from "./data";
import { TaskCard } from "./components/TaskCard";
import { NewTaskForm } from "./components/NewTaskForm";
import { useLocalStorage } from "usehooks-ts";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { updateTaskCompletion } from "convex/task";
const exampleTasks: Task[] = [
  {
    id: 1,
    title: "Take a picture of me",
    description: "I want a picture of myself",
    requester: "Alice",
    taskType: "info",
    completed: false,
    location: "43.47209774864078,-80.54050653819894",
  },
  {
    id: 2,
    title: "Buy me a coffee",
    description: "I want a coffee",
    requester: "Bob",
    taskType: "task",
    completed: false,
    location: "43.47209774864078,-80.54050653819894",
  },
  {
    id: 3,
    title: "Tell me a joke",
    description: "I want to laugh",
    requester: "Charlie",
    taskType: "info",
    completed: false,
    location: "43.47209774864078,-80.54050653819894",
  },
  {
    id: 4,
    title: "Fix my computer",
    description: "I need help with my computer",
    requester: "David",
    taskType: "task",
    completed: false,
    location: "43.47209774864078,-80.54050653819894",
  },
];

export const App: React.FC = () => {
  const tasks = useQuery(api.task.allTasks);
  const notCompletedTasks = useMemo(
    () => tasks?.filter((t) => !t.completed),
    [tasks]
  );
  const updateTaskCompletion = useMutation(api.task.updateTaskCompletion);
  const newTask = useMutation(api.task.createTask);
  const completedTasks = useMemo(
    () => tasks?.filter((t) => t.completed),
    [tasks]
  );
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // useEffect(() => {
  //   // Fetch initial tasks (replace with actual Convex query)
  //   mockConvex.query("getTasks").then(setTasks);
  //   mockConvex.query("getCompletedTasks").then(setCompletedTasks);
  // }, []);

  // const handleNewTask = (taskData: Task) => {
  //   mockConvex.mutation("createTask", taskData).then((newTask) => {
  //     setTasks([...tasks, { ...taskData, id: newTask.id }]);
  //   });
  // };

  // const handleCompleteTask = (taskId: number) => {
  //   const task = tasks.find((t) => t.id === taskId);
  //   if (task) {
  //     mockConvex.mutation("completeTask", { taskId }).then(() => {
  //       setTasks(tasks.filter((t) => t.id !== taskId));
  //       setCompletedTasks([...completedTasks, task]);
  //     });
  //   }
  // };

  // const handleDownvoteTask = (taskId: number) => {
  //   mockConvex.mutation("downvoteTask", { taskId }).then(() => {
  //     setTasks(tasks.filter((t) => t.id !== taskId));
  //   });
  // };

  return (
    <div className="h-full overflow-y-auto flex flex-col sm:max-w-screen-sm sm:mx-auto sm:p-8 p-4">
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
          {notCompletedTasks ? (
            notCompletedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onComplete={() => {
                  updateTaskCompletion({ id: task._id });
                }}
                onDownvote={() => {}}
              />
            ))
          ) : (
            <div>No tasks</div>
          )}
        </TabsContent>
        <TabsContent
          value="completed"
          className="flex-grow min-h-0 m-4 overflow-y-auto"
        >
          {completedTasks ? (
            completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => {}}
                onDownvote={() => {}}
              />
            ))
          ) : (
            <div>No tasks</div>
          )}
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
              onSubmit={(taskData) => {
                newTask({
                  title: taskData.title,
                  description: taskData.description,
                  requester: taskData.requester,
                  taskType: taskData.taskType,
                  location: "Unknown",
                });
              }}
              onClose={() => setIsNewTaskModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
