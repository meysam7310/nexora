
import type {
  StatCard,
  RevenueData,
  Project,
  Activity,
} from "@/types/dashboard";

export const stats: StatCard[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "$84,254",
    change: 12.8,
    description: "vs. previous month",
    icon: "wallet",
    color: "purple",
  },
  {
    id: "customers",
    title: "Total Customers",
    value: "2,420",
    change: 8.4,
    description: "vs. previous month",
    icon: "users",
    color: "blue",
  },
  {
    id: "projects",
    title: "Active Projects",
    value: "128",
    change: 6.2,
    description: "vs. previous month",
    icon: "folder",
    color: "green",
  },
  {
    id: "growth",
    title: "Growth Rate",
    value: "24.8%",
    change: 4.6,
    description: "vs. previous month",
    icon: "trending",
    color: "orange",
  },
];

export const revenueData: RevenueData[] = [
  { month: "Jan", revenue: 12000, expenses: 7200 },
  { month: "Feb", revenue: 18000, expenses: 9500 },
  { month: "Mar", revenue: 15000, expenses: 8500 },
  { month: "Apr", revenue: 24000, expenses: 12000 },
  { month: "May", revenue: 21000, expenses: 11000 },
  { month: "Jun", revenue: 30000, expenses: 14000 },
  { month: "Jul", revenue: 27000, expenses: 13000 },
  { month: "Aug", revenue: 35000, expenses: 17000 },
  { month: "Sep", revenue: 32000, expenses: 16000 },
  { month: "Oct", revenue: 42000, expenses: 19000 },
  { month: "Nov", revenue: 38000, expenses: 18000 },
  { month: "Dec", revenue: 48000, expenses: 22000 },
];

export const projects: Project[] = [
  {
    id: "NX-001",
    name: "Website Redesign",
    client: "Acme Corporation",
    progress: 85,
    status: "In Progress",
    dueDate: "Dec 18, 2026",
  },
  {
    id: "NX-002",
    name: "Mobile Application",
    client: "Vertex Solutions",
    progress: 100,
    status: "Completed",
    dueDate: "Dec 12, 2026",
  },
  {
    id: "NX-003",
    name: "Brand Identity",
    client: "Nova Studios",
    progress: 45,
    status: "Review",
    dueDate: "Dec 24, 2026",
  },
  {
    id: "NX-004",
    name: "CRM Integration",
    client: "Cloudify Inc.",
    progress: 30,
    status: "On Hold",
    dueDate: "Dec 28, 2026",
  },
];

export const activities: Activity[] = [
  {
    id: "1",
    user: "Alex Morgan",
    action: "completed the project",
    target: "Mobile Application",
    time: "12 minutes ago",
    initials: "AM",
  },
  {
    id: "2",
    user: "Sarah Chen",
    action: "added a new customer",
    target: "Vertex Solutions",
    time: "35 minutes ago",
    initials: "SC",
  },
  {
    id: "3",
    user: "James Wilson",
    action: "updated the project",
    target: "Website Redesign",
    time: "1 hour ago",
    initials: "JW",
  },
  {
    id: "4",
    user: "Emily Davis",
    action: "created a new task",
    target: "Homepage UI Design",
    time: "2 hours ago",
    initials: "ED",
  },
];

import type { Notification } from "@/types/dashboard";

export const notifications: Notification[] = [
  {
    id: "NT-001",
    title: "Project completed",
    message: "Mobile Application has been marked as completed.",
    time: "5 minutes ago",
    type: "project",
    isRead: false,
  },
  {
    id: "NT-002",
    title: "New team member",
    message: "A new member joined your workspace.",
    time: "1 hour ago",
    type: "team",
    isRead: false,
  },
  {
    id: "NT-003",
    title: "Payment received",
    message: "Your latest payment has been successfully recorded.",
    time: "3 hours ago",
    type: "payment",
    isRead: false,
  },
  {
    id: "NT-004",
    title: "Weekly report ready",
    message: "Your workspace performance report is available.",
    time: "Yesterday",
    type: "system",
    isRead: true,
  },
];
