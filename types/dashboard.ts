
export interface StatCard {
  id: string;
  title: string;
  value: string;
  change: number;
  description: string;
  icon: string;
  color: "purple" | "blue" | "green" | "orange";
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

export type ProjectStatus =
  | "In Progress"
  | "Completed"
  | "On Hold"
  | "Review";

export interface Project {
  id: string;
  name: string;
  client: string;
  progress: number;
  status: ProjectStatus;
  dueDate: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  initials: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "project" | "payment" | "team" | "system";
  isRead: boolean;
}
