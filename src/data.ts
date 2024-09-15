export interface Task {
  [x: string]: any;
  id: number;
  title: string;
  description: string;
  requester: string;
  taskType: TaskType;
  completed: boolean;
  location: string;
}

export type TaskType = "info" | "task";
