
export type CustomerStatus = "Active" | "Pending" | "Inactive";

export type Customer = {
  id: number;
  name: string;
  email: string;
  company: string;
  status: CustomerStatus;
  joined: string;
  spent: number;
  initials: string;
  color: string;

  // Additional customer information
  phone?: string;
  location?: string;
  notes?: string;
};

export const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Olivia Rhye",
    email: "olivia@acme.com",
    company: "Acme Inc.",
    status: "Active",
    joined: "Nov 12, 2026",
    spent: 12450,
    initials: "OR",
    color: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    phone: "+1 555 012 3456",
    location: "New York, USA",
    notes: "Important client. Prefers communication via email.",
  },
  {
    id: 2,
    name: "Phoenix Baker",
    email: "phoenix@techflow.com",
    company: "TechFlow",
    status: "Active",
    joined: "Nov 10, 2026",
    spent: 8920,
    initials: "PB",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    phone: "+1 555 023 4567",
    location: "San Francisco, USA",
    notes: "Interested in long-term collaboration.",
  },
  {
    id: 3,
    name: "Lana Steiner",
    email: "lana@studio.com",
    company: "Studio Co.",
    status: "Pending",
    joined: "Nov 08, 2026",
    spent: 4200,
    initials: "LS",
    color: "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400",
    phone: "+1 555 034 5678",
    location: "London, UK",
    notes: "Waiting for project confirmation.",
  },
  {
    id: 4,
    name: "Demi Wilkinson",
    email: "demi@bright.io",
    company: "Bright Studio",
    status: "Active",
    joined: "Nov 05, 2026",
    spent: 15600,
    initials: "DW",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    phone: "+1 555 045 6789",
    location: "Austin, USA",
    notes: "Regular customer.",
  },
  {
    id: 5,
    name: "Candice Wu",
    email: "candice@orbit.com",
    company: "Orbit Design",
    status: "Inactive",
    joined: "Oct 28, 2026",
    spent: 2750,
    initials: "CW",
    color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
    phone: "+1 555 056 7890",
    location: "Toronto, Canada",
    notes: "No recent activity.",
  },
  {
    id: 6,
    name: "Natali Craig",
    email: "natali@pixel.com",
    company: "Pixel Labs",
    status: "Active",
    joined: "Oct 24, 2026",
    spent: 9800,
    initials: "NC",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    phone: "+1 555 067 8901",
    location: "Chicago, USA",
    notes: "Interested in new design projects.",
  },
  {
    id: 7,
    name: "Drew Cano",
    email: "drew@vertex.com",
    company: "Vertex Group",
    status: "Pending",
    joined: "Oct 20, 2026",
    spent: 3600,
    initials: "DC",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
    phone: "+1 555 078 9012",
    location: "Berlin, Germany",
    notes: "Awaiting payment confirmation.",
  },
  {
    id: 8,
    name: "Orlando Diggs",
    email: "orlando@nexus.com",
    company: "Nexus Digital",
    status: "Active",
    joined: "Oct 16, 2026",
    spent: 18900,
    initials: "OD",
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
    phone: "+1 555 089 0123",
    location: "Dubai, UAE",
    notes: "High-value customer.",
  },
];

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
