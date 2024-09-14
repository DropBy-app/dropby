import { query } from "../convex/_generated/server";

export interface Task {
  id: number;
  title: string;
  description: string;
  requester: string;
  taskType: TaskType;
  completed: boolean;
}

export type TaskType = "info" | "task";
