# Smart Project & Task Collaboration System (Frontend Workspace)

### High-Density Interactive Project Management Client

This repository contains the frontend client for the Smart Project Management System. Built with a focus on seamless user experience and strict operational role enforcement, it delivers a high-performance interactive workspace featuring drag-and-drop Kanban boards, real-time analytic dashboards, and professional rich-text documentation.

---

## 🌐 Live Application & Repositories

| Component              | Live Application                                                               | GitHub Repository                                                             |
| :--------------------- | :----------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **Frontend Workspace** | [Access Live Dashboard](https://project-management-frontend-3we9.onrender.com) | [Client Repository](https://github.com/Alamin-22/project-management-frontend) |
| **Backend API Engine** | [API Gateway](https://project-management-backend-l2ru.onrender.com/api/v1)     | [Server Repository](https://github.com/Alamin-22/project-management-backend)  |

> **Note on Cold Starts:** The backend API is hosted on Render's free tier. If the application has been inactive, logging in or fetching initial data may take **30–60 seconds** as the server container wakes up.

---

## 🔐 Demo Credentials

Use these credentials to evaluate the Role-Based Access Control (RBAC) and customized dashboard views:

- **Manager / Admin**: `manager@smartproject.com` | `admin123456`
- **Team Member**: `member@smartproject.com` | `member123456`

---

## 🎯 Core Features & UI Architecture

- **Role-Based Workspaces**: Distinct routing and UI layouts for Project Managers (Global scope, Team management) vs. Team Members (Personal task scope).
- **Advanced Task Board**: Fully interactive Kanban interface using `@dnd-kit` with client-side drag-and-drop validation that prevents unauthorized status changes.
- **Rich Document Editor**: Integrated `Tiptap` editor allowing for professional formatting and media attachments inside task descriptions.
- **Real-Time Analytics**: Visual KPI metrics and progress bars rendered via `ApexCharts` to monitor team workload and deadline risks.
- **State Management**: Centralized API caching and state synchronization using Redux Toolkit (RTK Query).

---

## 🛠️ Technical Stack (Frontend)

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 & ShadCn
- **Data Fetching & State**: Redux Toolkit & RTK Query
- **Forms & Validation**: React Hook Form + Zod
- **Complex UI Integrations**: `@dnd-kit` (Drag & Drop), `@tiptap/react` (Rich Text Editor)

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory of the frontend project.

```env
# Point this to your local backend during development, or the live Render API for production
NEXT_PUBLIC_API_BASE_URL=[https://project-management-backend-l2ru.onrender.com/api/v1](https://project-management-backend-l2ru.onrender.com/api/v1)

or for local

PORT=3000
NODE_ENV=production
NEXT_PUBLIC_CLIENT_SITE_URL= http://localhost:3000
NEXT_PUBLIC_API_BASE_URL= http://localhost:5000/api/v1
INTERNAL_SERVER_API= http://localhost:5000/api/v1
```



## 📦 Local Installation & Development

### 1. Prerequisites

- Node.js (v20+ recommended)
- The Backend API running locally (or simply use the live API URL in your `.env.local`)

### 2. Setup Guide

```bash
# Clone the frontend repository
git clone https://github.com/Alamin-22/project-management-frontend
cd project-management-frontend

# Install dependencies
npm install

# Start the development server
npm run dev

```

Navigate to `http://localhost:3000` to view the application.

---

## 🚀 Production Deployment Notes

This project is configured for deployment as a Static Site on platforms like Render .

- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `.next`
- **Important Note**: Because this project utilizes Tailwind CSS v4, `@tailwindcss/postcss` must be installed as a standard dependency (not just a devDependency) for cloud build environments to correctly compile the `globals.css` file.

---

## 📑 Internal Documentation

A full **Operations Manual** detailing system logic, audit restrictions, and project workflows is integrated directly into the application. Once logged in, navigate to the `Documentation` Page.

---

**Developed by Md. Al Amin Mollik.** _Scalable. Secure. Project-Centric._

