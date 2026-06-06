
---

# Smart Project & Task Collaboration System

### Enterprise-Grade Project Lifecycle & Team Productivity Engine

A full-stack, project-centric management ecosystem designed to streamline task execution, team collaboration, and workflow transparency. This system empowers managers to oversee project lifecycles from initialization to completion while providing team members with an intuitive, status-driven task execution environment.

---

## 🌐 Deployment & Access

| Component             | Live Application (Render)                                                                  | Repository Link                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| **Project Workspace** | [Access Dashboard](https://www.google.com/search?q=https://your-frontend-url.onrender.com) | [Client Repository](https://github.com/Alamin-22/project-management-frontend) |
| **API Gateway**       | [API Service](https://www.google.com/search?q=https://your-backend-url.onrender.com)       | [Server Repository](https://github.com/Alamin-22/project-management-backend) |

> **Deployment Note:** This project is hosted on Render's free-tier infrastructure. If the application has been inactive, the container may take **30–60 seconds** to "wake up" upon your first request. Please be patient during the initial load.

---

## 🎯 Project Purpose

The system provides a unified operational command center for teams to:

- **Centralize Lifecycle Management**: Projects serve as the root container for all tasks, team assignments, and analytical data.
- **Enforce Operational Integrity**: Role-Based Access Control (RBAC) ensures Team Members only interact with tasks assigned to them, while PMs maintain full oversight.
- **Audit & Accountability**: A hardened system-wide audit log records every status change, deletion, and reorder event.
- **Visualize Productivity**: Real-time KPI tracking and Team Analytics offer deep visibility into workload distribution and bottlenecks.

---

## 🚀 Core Features

- **Project-Centric Kanban**: Drag-and-drop task boards with permission-locked status updates.
- **Role-Based Workflows**: Custom views for Managers (Global Analytics/Logs) vs. Team Members (Personal Tasks).
- **Intelligent Validation**: Automated conflict handling (duplicate title prevention, deadline date enforcement, reassignment locks).
- **Rich Task Context**: Built-in Rich-Text editing and comment threads for seamless collaboration.
- **System Health & Security**: Live security monitoring, audit trail analysis, and Master Key override protocols.

---

## 🛠️ Technical Stack

### **Frontend**

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Radix UI
- **Data Fetching**: Redux Toolkit (RTK Query)
- **Validation**: React Hook Form + Zod

### **Backend**

- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT Stateless Auth & Bcrypt

---

## ⚙️ Environment Configuration

Create a `.env` file in the root of both client and server:

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.onrender.com/api/v1

# Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key

```

---

## 📦 Local Installation Guide

### **1. Server Setup**

```bash
git clone <server-repo-url>
cd project-name-server
npm install
# Update .env with MongoDB URI & Secrets
npm run start:dev

```

### **2. Client Setup**

```bash
git clone <client-repo-url>
cd project-name-client
npm install
# Update .env.local with your backend API URL
npm run dev

```

---

## 🔐 Demo Credentials

Use these credentials to evaluate the role-based functionality:

- **Manager/PM**: `manager@smartproject.com` | `123456`
- **Team Member**: `member@smartproject.com` | `123456`

---

## 📑 Versioning & Documentation

- **Version**: `1.0.0`
- **Documentation**: A full _Manager Operations Manual_ is integrated directly into the dashboard under the `Manager Workspace > Documentation` tab.

---

**Developed by Md. Al Amin Mollik.**

_Scalable. Secure. Project-Centric._

---

