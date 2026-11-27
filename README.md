# Nexora

### Business Management Workspace

**One workspace. Complete business visibility.**

Nexora is a modern business management workspace designed to bring customer relationships, project operations, task management, and business insights together in one unified interface.

Built with a focus on usability, reusable component architecture, and a consistent user experience, Nexora provides an organized environment for managing everyday business operations.

**[Live Demo](https://nexora.meysam-bagheri93.workers.dev)** · **[GitHub Repository](https://github.com/meysam7310/nexora)**

---

## Overview

Nexora provides a centralized workspace for organizing business activities and monitoring operational performance.

The platform combines an interactive dashboard with dedicated management areas, allowing users to navigate between customers, projects, tasks, financial information, and business reports through a consistent interface.

Its interface is designed around clear information hierarchy, practical workflows, and responsive layouts.

## Core Capabilities

### Dashboard & Analytics
- Business performance overview
- Key operational metrics
- Revenue and performance visualizations
- Recent activity overview

### Customer Management
- Centralized customer directory
- Individual customer profiles
- Customer information management
- Search and navigation workflows

### Project Management
- Project overview and detailed project views
- Project status and progress tracking
- Budget allocation and expenditure summaries
- Project-specific task management

### Task Management
- Create and delete tasks
- Track task completion
- Filter tasks by status
- Assign task priorities

### Business Operations
- Financial overview
- Reports and data visualization
- Team management workspace
- Workspace and profile settings
- Help and support interface

### User Experience
- Responsive dashboard layouts
- Dark and light themes
- Persistent theme preferences
- Consistent UI components and interactions
- Iconography powered by Lucide React

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Application framework and routing |
| React 19 | Component-based UI |
| TypeScript 5 | Static typing |
| Tailwind CSS 4 | Utility-first styling |
| Recharts 3 | Data visualization |
| Lucide React | Interface icons |
| OpenNext | Next.js deployment integration |
| Cloudflare Workers | Application hosting |
| Wrangler | Cloudflare development and deployment |

## Application Architecture

Nexora follows a modular application structure using the Next.js App Router.

```text
nexora/
├── app/
│   ├── (dashboard)/
│   │   ├── customers/
│   │   ├── finance/
│   │   ├── help/
│   │   ├── projects/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── tasks/
│   │   └── team/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── dashboard/
│   ├── layout/
│   ├── providers/
│   └── settings/
│
├── data/
├── hooks/
├── public/
├── types/
│
├── next.config.ts
├── open-next.config.ts
├── package.json
└── wrangler.jsonc
```

### Architecture Highlights

- Modular page organization with Next.js App Router
- Reusable dashboard and layout components
- Dedicated providers for application preferences
- Custom React hooks for client-side data management
- Centralized data and TypeScript definitions
- Consistent styling through Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/meysam7310/nexora.git
```

Navigate to the project:

```bash
cd nexora
```

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the Next.js application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run preview` | Build and preview the Cloudflare application |
| `npm run deploy:cf` | Build and deploy to Cloudflare Workers |
| `npm run upload` | Build and upload the Cloudflare application |
| `npm run cf-typegen` | Generate Cloudflare environment types |

## Deployment

Nexora is configured for deployment on Cloudflare Workers using OpenNext.

The deployment workflow uses Wrangler and the OpenNext Cloudflare adapter.

To deploy the application:

```bash
npm run deploy:cf
```

A configured Cloudflare account and the required Wrangler environment settings are needed before deployment.

## Data & Application Scope

The current implementation focuses on the frontend experience and client-side interactions.

Application data is managed through client-side state and browser Local Storage where persistence is implemented. Initial content also includes predefined demonstration data.

A server-side backend, database, authentication service, and cross-device data synchronization are not included in the current implementation.

## Project Direction

Nexora is structured around a modular frontend architecture, with an emphasis on maintainable components, consistent interactions, and a cohesive business management experience.

The application provides a foundation for further development of business workflows and future backend integration.

---

**Nexora — Business Management Workspace**

Built with Next.js, React, and TypeScript.