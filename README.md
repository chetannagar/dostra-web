# CRM Frontend Project Spec

## Overview

Build a single React + Vite CRM frontend for two user roles:

- `admin`: full access to all leads and full CRUD operations
- `client`: access only to leads assigned to that client, with limited editing permissions

The frontend will consume a Laravel/PHP backend over REST APIs. The main objective is to demonstrate solid frontend structure, role-based access control, responsive UI, and clean API integration for a small internship-scale dataset.

## Recommended Frontend Stack

- React
- Vite
- TypeScript
- React Router
- TanStack Query for server state
- Zustand or Context API for auth/session state
- Tailwind CSS for fast, responsive UI
- React Hook Form + Zod for forms and validation

This stack is pragmatic for a small-to-medium frontend and keeps state concerns clear:

- auth/session state stays local
- API data stays cached and synchronized through TanStack Query
- forms remain predictable and easy to validate

## User Roles

### Admin

Permissions:

- View all leads
- Create new leads
- Edit any lead
- Delete any lead
- Search, filter, sort, and paginate all leads
- View dashboard with global metrics

### Client

Permissions:

- View only leads assigned to them
- Open lead detail pages for assigned leads only
- Edit restricted fields on assigned leads:
  - `notes`
  - `status`
- View a limited dashboard relevant to their own leads

Not allowed:

- View other clients' leads
- Create leads unless backend requirements later allow it
- Delete leads
- Edit protected lead fields like ownership or contact data unless explicitly allowed

## Suggested Routes

Public:

- `/login`

Protected:

- `/dashboard`
- `/leads`
- `/leads/new` admin only
- `/leads/:id`
- `/leads/:id/edit` admin only

Optional:

- `/profile`
- `/unauthorized`
- `*` not found route

## Route Access Rules

- Unauthenticated users are redirected to `/login`
- Authenticated admins can access all protected pages
- Authenticated clients are blocked from admin-only routes
- Client access to `/leads/:id` must also be validated against assigned ownership

Frontend guards improve UX, but backend authorization remains the source of truth.

## Lead Data Model

The exact API contract still needs confirmation. A practical lead shape for the frontend is:

```ts
type UserRole = "admin" | "client";

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "won"
  | "lost";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: LeadStatus;
  notes: string;
  assignedClientId: number | null;
  assignedClientName?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Suggested Auth/User Model

```ts
interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "client";
}
```

Expected auth flow:

1. User logs in with backend credentials
2. Backend returns token or session cookie plus user profile
3. Frontend stores auth state
4. Protected routes and UI are rendered based on role

## Core Pages

### Login Page

- Email/password form
- Validation and error handling
- Redirect to dashboard after success

### Dashboard

Admin dashboard:

- Total leads
- Leads by status
- Recent activity or recently updated leads
- Quick links to create or manage leads

Client dashboard:

- My total leads
- My leads by status
- Recently updated assigned leads

### Leads List Page

Features:

- Table or card list
- Search by name, email, phone, company
- Filter by status
- Sort by updated date, created date, name, status
- Pagination
- Role-aware actions

Admin actions:

- View
- Edit
- Delete
- Create lead button

Client actions:

- View only assigned leads
- Edit limited fields where allowed

### Lead Detail Page

Shows:

- Basic lead information
- Notes
- Status
- Ownership/assignment
- Created and updated timestamps

Admin can:

- Edit all fields
- Delete lead

Client can:

- View assigned lead details
- Update notes and status only

### Lead Create/Edit Form

Admin form fields:

- Name
- Email
- Phone
- Company
- Status
- Notes
- Assigned client

Client edit form:

- Notes
- Status

## State Management Plan

Use separate layers:

- Auth store:
  - current user
  - login/logout
  - token/session bootstrap
- Query layer:
  - leads list
  - lead detail
  - dashboard summary
  - create/update/delete mutations
- UI state:
  - filters
  - sort config
  - pagination
  - modal visibility

## API Integration Plan

The backend contract should ideally expose endpoints similar to:

```http
POST /api/login
POST /api/logout
GET /api/me

GET /api/leads
GET /api/leads/:id
POST /api/leads
PUT /api/leads/:id
DELETE /api/leads/:id

GET /api/dashboard
```

Recommended expectations:

- Backend filters client-visible leads automatically
- Backend rejects unauthorized actions even if frontend attempts them
- Validation errors return structured messages
- Pagination metadata is included for the leads listing

Example paginated response shape:

```ts
interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}
```

## Role-Based UI Rules

### Admin UI

- Show create button
- Show edit/delete actions
- Show assigned client information
- Show all records in list and dashboard

### Client UI

- Hide create/delete actions
- Restrict list to assigned leads
- Disable or remove protected form inputs
- Prevent navigation to admin-only pages

## Suggested Folder Structure

```txt
src/
  api/
    client.ts
    auth.ts
    leads.ts
    dashboard.ts
  app/
    router.tsx
    providers.tsx
  components/
    ui/
    layout/
    leads/
  features/
    auth/
    dashboard/
    leads/
  hooks/
  lib/
    constants.ts
    guards.ts
    utils.ts
  pages/
    LoginPage.tsx
    DashboardPage.tsx
    LeadsPage.tsx
    LeadDetailPage.tsx
    LeadFormPage.tsx
    UnauthorizedPage.tsx
  stores/
    authStore.ts
  types/
    auth.ts
    lead.ts
  main.tsx
```

## UI Notes

The interface should prioritize clarity over density because the dataset is small.

Recommended approach:

- Responsive sidebar or top navigation
- Summary cards on dashboard
- Simple data table for desktop
- Card layout fallback for mobile
- Clear badge styles for lead status
- Empty states and loading states on every data screen

## Validation Rules

Suggested frontend validation:

- `name`: required
- `email`: required, valid email format
- `phone`: required
- `status`: required
- `notes`: optional unless business rules require it
- `assignedClientId`: required for admin-created client-owned leads if ownership is mandatory

## Key Unknowns To Confirm

These should be clarified with the backend owner or assignment reviewer:

1. Can clients create leads?
2. What exact lead fields are required?
3. How is lead ownership represented in the API?
4. What authentication mechanism is used?
   - session cookies
   - Sanctum
   - JWT
5. What does the dashboard endpoint return, if any?
6. Are notes/status updates separate endpoints or part of general lead update?
7. What pagination/filter/sort query parameters does the backend support?

## Recommended MVP Scope

Phase 1:

- Login
- Protected routes
- Role-aware navigation
- Leads list
- Lead detail
- Admin create/edit/delete
- Client notes/status edit

Phase 2:

- Dashboard summaries
- Search, filter, sort
- Pagination
- Better error states and polish

Phase 3:

- Optimistic UI updates where safe
- Reusable table/filter components
- Better analytics cards

## Suggested Delivery Order

1. Initialize React + Vite + TypeScript app
2. Add routing and auth shell
3. Create API client and auth flow
4. Implement role guards
5. Build leads list and detail pages
6. Build admin CRUD forms
7. Build client limited edit flow
8. Add dashboard
9. Add search/filter/sort/pagination
10. Polish UI and edge states

## Practical Assumptions For Starting Development

Unless told otherwise, these are reasonable assumptions:

- Clients cannot create leads
- Each lead belongs to zero or one client
- Clients may edit only `notes` and `status`
- Admins have unrestricted lead management access
- Backend enforces real authorization rules
- The frontend uses TypeScript

## Definition of Done

The frontend is complete when:

- Users can authenticate successfully
- Admins can manage all leads end to end
- Clients can only access their own leads
- Client-only restrictions are visible in UI and enforced in navigation
- Leads pages support list and detail flows cleanly
- The app works on desktop and mobile
- API errors, loading states, and empty states are handled clearly
