export interface Task {
  id: number;
  title: string;
  description: string;
  requester: string;
  taskType: TaskType;
}

export type TaskType = "info" | "task";
