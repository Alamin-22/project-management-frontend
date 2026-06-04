# Professional Inventory Management System (IMS)

### Full-Stack Enterprise Resource Planning & POS Control Center

A high-density, modular Management System designed to bridge the gap between retail Point of Sale (POS) operations and back-office financial auditing. This system provides real-time inventory intelligence, role-based access control, and automated ledger synchronization.

---

## 🌐 Deployment & Repository Links

| Component             | Live Demo (Vercel)                                                         | Repository Link                                                              |
| :-------------------- | :------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| **Frontend Terminal** | [View Live Demo](https://www.google.com/search?q=INSERT_FRONTEND_URL_HERE) | [Client Repo](https://github.com/Alamin-22/Inventory-Management-Client)  |
| **Backend Engine**    | [API Gateway](https://www.google.com/search?q=INSERT_BACKEND_URL_HERE)     | [Server Repo](https://github.com/Alamin-22/Inventory-Management-server) |

---

## 🎯 Project Purpose

The core objective of this IMS is to provide small-to-medium businesses with a unified platform to:

- **Prevent Stock Outs**: Real-time monitoring and priority restock queues.
- **Audit Financials**: Every transaction (Sale/Refund/Manual Collection) is logged in a permanent, non-editable ledger.
- **Streamline POS**: A high-speed checkout interface designed for rapid "Terminal" style operation.
- **Security & Accountability**: Detailed Audit Logs track which staff member performed which action.

---

## 🚀 Core Modules

- **Point of Sale (POS)**: Dynamic cart logic with instant stock validation and multi-method payment support.
- **Business Intelligence Dashboard**: Real-time analytics showing Month-over-Month (MoM) revenue, daily sales volume, and inventory health.
- **Financial Audit Trail**: A sophisticated ledger system that links every financial movement to a specific Order ID.
- **Inventory Management**: Advanced product tracking with support for variants, SKUs, and categorized stock-level alerts.
- **Staff Control (RBAC)**: Comprehensive user management with granular permissions for Super Admins, Admins, and Managers.

---

## 🛠️ Technical Stack

### **Frontend (Terminal)**

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 (High-Density UI Architecture)
- **State Management**: Redux Toolkit (RTK Query for cached API syncing)
- **Forms**: React Hook Form + Zod (Strict Schema Validation)

### **Backend (Engine)**

- **Runtime**: Node.js & Express.js
- **Language**: TypeScript (Strict Type Safety)
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT (Stateless Authentication) & Bcrypt (Password Hashing)

---

## ⚙️ Environment Configuration

### **Frontend (inventory-management-client)**

Create a `.env.local` file in the client root:

```env
PORT=3000
NODE_ENV=production
NEXT_PUBLIC_CLIENT_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
INTERNAL_SERVER_API=http://localhost:5000/api/v1
```

## 📦 Local Installation Guide

### **1. Prerequisites**

- Node.js (v24.x or higher)
- MongoDB Atlas Account or Local MongoDB Instance

### **2. Server Setup**

```bash
cd inventory-management-server
npm install
# Configure your .env file as shown above
npm run build
npm run start:dev
```

### **3. Client Setup**

```bash
cd inventory-management-client
npm install
# Configure your .env.local as shown above
npm run dev
```

---

## 📑 Versioning & Changelog

This project is currently in **Beta Testing Phase**.

- **Current Version**: `1.0.0-beta.1`
- **Status**: Production Ready for Demo Evaluation.
- Detailed iteration notes can be found in the `CHANGELOG.md` of the respective repositories.

---

**Developed by Md. Al Amin Mollik. All rights reserved.**
_Focused on scalability, security, and operational transparency._
