import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskCard } from "./components/TaskCard";
import { NewTaskForm } from "./components/NewTaskForm";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useLocalStorage } from "usehooks-ts";
export const App: React.FC = () => {
  const tasks = useQuery(api.task.allTasks);
  const [downvotedTasks, setDownvotedTasks] = useLocalStorage<string[]>(
    "downvotedTasks",
    []
  );
  const notCompletedTasks = useMemo(
    () =>
      tasks
        ?.filter((t) => !t.completed)
        .filter((t) => !downvotedTasks.includes(t._id))
        .slice(0)
        .reverse(),
    [tasks, downvotedTasks]
  );
  const updateTaskCompletion = useMutation(api.task.updateTaskCompletion);
  const newTask = useMutation(api.task.createTask);
  const completedTasks = useMemo(
    () =>
      tasks
        ?.filter((t) => t.completed)
        .filter((t) => !downvotedTasks.includes(t._id))
        .slice(0)
        .reverse(),
    [tasks, downvotedTasks]
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
        <TabsList className="grid w-full grid-cols-2 select-none">
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
                downvotedTasks={downvotedTasks}
                setDownvotedTasks={setDownvotedTasks}
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
                key={task._id}
                task={task}
                completed
                onComplete={() => {}}
                onDownvote={() => {}}
                downvotedTasks={downvotedTasks}
                setDownvotedTasks={setDownvotedTasks}
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
            <Button className="w-full select-none">New Task</Button>
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
                  location: taskData.location,
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
