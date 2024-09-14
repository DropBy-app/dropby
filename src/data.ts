export interface Task {
  id: number;
  title: string;
  description: string;
  requester: string;
  taskType: TaskType;
  completed: boolean;
  location: string;
}

export type TaskType = "info" | "task";
