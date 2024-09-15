export interface ClientTask {
  title: string;
  description: string;
  requester: string;
  taskType: TaskType;
  completed: boolean;
  location: string;
}

export interface Task extends ClientTask {
  _id: string;
  // in milliseconds
  _creationTime: number;
}

export type TaskType = "info" | "task";
