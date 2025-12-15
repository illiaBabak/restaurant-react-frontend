# 🍽️ Restaurant Management Frontend

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF6A3D?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query/latest)
[![TanStack Table](https://img.shields.io/badge/TanStack_Table-0F172A?style=for-the-badge&logo=reacttable&logoColor=white)](https://tanstack.com/table/latest)
[![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=04C38E)](https://www.cypress.io/)

> A frontend pet project for managing restaurant data with interactive tables and a custom backend

## 📸 Project Preview

![View](https://docs.google.com/uc?id=1uGlbaSA2WrSoiGTafv3RwNqpq4lNPKdU)

## 🎯 Project Goal

This project was built as a **frontend for my own backend API**, with the main purpose to:

- **Practice building an admin panel** for managing dishes, waiters and bills
- **Work with TanStack Table** for powerful, customizable data tables
- **Integrate with a custom REST backend** and handle real-world API flows
- **Experiment with testing tools** (Cypress)

## 🚀 Tech Stack

### Core Technologies

- **React 19** — UI library for building the application
- **TypeScript** — typed superset of JavaScript
- **Vite** — fast dev server and bundler
- **SCSS + Tailwind CSS** — styling and layout
- **React Router** — client-side routing between pages

### Data & State

- **TanStack Query (React Query)** — server state management, caching, loading/error handling
- **TanStack Table (React Table)** — flexible, headless table logic for lists (dishes, waiters, bills)

## ✨ Features

### 📊 Admin Panel

- Management of **dishes**, **waiters** and **bills** via interactive tables
- Sorting, basic filtering and searching using **TanStack Table**
- Modals and forms for creating/editing entities

### 🧾 Receipt Page

- Dedicated **receipt view** for displaying bill details
- Data loaded from the custom backend via API calls
- Graceful handling of loading and error states

### 🔄 Backend Integration

- Uses **my own backend API** for all restaurant data
- **TanStack Query** is used to:
  - fetch and cache data
  - manage loading and error states
  - keep UI in sync with backend updates

## 🛠 Setup and Scripts

### Prerequisites

- Node.js (recommended **v18+**)
- **pnpm** (or npm/yarn)

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

## 📁 Project Structure

```text
src/
├── api/                 # API clients and helpers for backend requests
├── components/          # Reusable React components
│   ├── Alert/
│   ├── Dropdown/
│   ├── FormInput/
│   ├── Header/
│   ├── Loader/
│   ├── OverlayModal/
│   ├── Search/
│   ├── SideBar/
│   └── Table/
├── contexts/            # React context providers
├── pages/               # App pages (routes)
│   ├── Admin/           # Admin area
│   │   └── components/
│   │       ├── DishesManagment/
│   │       └── WaitersManagment/
│   ├── Receipt/         # Receipt page
│   └── NotFound/        # 404 page
├── root/                # Root app entry (routing, layout)
├── types/               # TypeScript types
└── utils/               # Helper utilities (guards, validators, constants, etc.)
```

## 🧪 Testing

The project is set up with **Cypress** for e2e tests

Example e2e run (after starting the dev server):

```bash
pnpm cypress open
```
