# MedicalLinks GCC - MVP Chunk 1

## Overview
This repository contains the foundation layer for **MedicalLinks GCC**, a specialized medical recruitment platform focusing on placing doctors into GCC hospitals. The current implementation represents "Chunk 1" which builds the technical skeleton, layout, UI primitives, and placeholder routing.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Custom primitive UI components (Button, Input, Card, etc.) styled similarly to shadcn/ui.
- **Validation**: Zod & React Hook Form (installed and ready)
- **ORM / Data**: Prisma (initialized)
- **Icons**: Lucide React

## What's Completed in Chunk 1
- Initialized Next.js 15 app with App Router and Tailwind v4.
- Established project folder structure (`src/app`, `src/components`, `src/lib`).
- Configured core layout shell including `Sidebar` and `Topbar`.
- Defined global design tokens for a professional, "medical-grade" aesthetic (in `globals.css`).
- Created shared UI primitives (`Button`, `Card`, `Input`, `PageHeader`, `EmptyState`).
- Built placeholder routes for:
  - Dashboard
  - Profile
  - Applications
  - Opportunities
  - Messages
  - Settings
  - Recruiter Dashboard
  - Hospitals
  - Admin
- Created mock data and enums representing GCC medical recruitment concepts (readiness labels, roles, application statuses).
- Initialized Prisma.
- Configured Zod schemas for validation foundation.

## Intentionally Deferred
- Real authentication/authorization (clerk/next-auth).
- Full database schema and backend implementation logic.
- Complex forms (Profile Builder, Quick Apply).
- Search/Filtering logic.
- Advanced matching algorithms.

## Dev Test Credentials (Local Development Only)

These local test accounts are seeded in the database for authentication testing. **Do not use these in production.**

| Role | Email | Password |
|---|---|---|
| Applicant | `applicant@medicallinks.local` | `Password123!` |
| Recruiter | `recruiter@medicallinks.local` | `Password123!` |
| Admin | `admin@medicallinks.local` | `Password123!` |
| Hospital Partner | `hospital@medicallinks.local` | `Password123!` |

## How to Run Locally & Test Login

1. Install dependencies:
   ```bash
   npm install
   ```

2. Ensure your local PostgreSQL database is running and `DATABASE_URL` is properly set in your `.env` file.

3. Run database migrations to sync your schema:
   ```bash
   npx prisma migrate dev
   ```

4. Seed the database to create the local test accounts:
   ```bash
   npx prisma db seed
   ```

5. Start the Next.js development server:
   ```bash
   npm run dev
   ```

6. Test the Authentication Flow:
   - Open [http://localhost:3000/login](http://localhost:3000/login) in your browser.
   - Enter one of the test credentials listed in the table above (e.g., `applicant@medicallinks.local` / `Password123!`).
   - Click "Sign In" to authenticate and access the application.

## Folder Structure
- `src/app`: Next.js App Router pages and global layouts.
- `src/components/layout`: Sidebar and Topbar structure.
- `src/components/ui`: Reusable styling primitives (Buttons, Cards, EmptyStates).
- `src/lib`: Utilities, constants, Zod validation logic, and mock data.
- `prisma`: Prisma schema and initialization configuration.
