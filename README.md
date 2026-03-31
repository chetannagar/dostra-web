<div align="center">

<br/>

```
██████╗  ██████╗ ███████╗████████╗██████╗  █████╗     ██╗    ██╗███████╗██████╗
██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗    ██║    ██║██╔════╝██╔══██╗
██║  ██║██║   ██║███████╗   ██║   ██████╔╝███████║    ██║ █╗ ██║█████╗  ██████╔╝
██║  ██║██║   ██║╚════██║   ██║   ██╔══██╗██╔══██║    ██║███╗██║██╔══╝  ██╔══██╗
██████╔╝╚██████╔╝███████║   ██║   ██║  ██║██║  ██║    ╚███╔███╔╝███████╗██████╔╝
╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝     ╚══╝╚══╝ ╚══════╝╚═════╝
```

*React + TypeScript CRM frontend for the Dostra system*

<br/>

[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square)](https://zod.dev/)

<br/>

</div>

---

## Overview

A single-page CRM frontend serving two distinct user roles — `admin` and `client` — built on a clean, layered React architecture. Consumes the `dostra-api` Laravel backend over REST.

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

> Copy `.env.example` to `.env` when setting up locally. Use `.env.local` for machine-specific overrides. Never commit secrets.

---

## Stack

| Concern | Library |
|---------|---------|
| **UI framework** | React + Vite + TypeScript |
| **Routing** | React Router |
| **Server state** | TanStack Query |
| **Client state** | Zustand or Context API |
| **Styling** | Tailwind CSS |
| **Forms & validation** | React Hook Form + Zod |

---

## User Roles

### `admin`
- Full CRUD over all leads
- View all clients, users, and assignments
- Access global dashboard metrics
- Search, filter, sort, and paginate all records

### `client`
- Read-only access to assigned leads
- Edit restricted fields only: `notes` and `status`
- View a dashboard scoped to their own leads
- No access to other clients' data, lead creation, or deletion

> Frontend guards improve UX — backend authorisation is always the source of truth.

---

## Routes

```
/login                      public

/dashboard                  protected — all roles
/leads                      protected — all roles
/leads/new                  protected — admin only
/leads/:id                  protected — all roles (client: assigned only)
/leads/:id/edit             protected — admin only

/profile                    optional
/unauthorized               optional
*                           not found
```

**Access rules:**
- Unauthenticated → redirect to `/login`
- Client user → blocked from admin-only routes
- Client access to `/leads/:id` → validated against assigned ownership

---

## Data Models

### Lead

```ts
type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "won"
  | "lost";

interface Lead {
  id:                 number;
  name:               string;
  email:              string;
  phone:              string;
  company?:           string;
  status:             LeadStatus;
  notes:              string;
  assignedClientId:   number | null;
  assignedClientName?: string;
  createdAt:          string;
  updatedAt:          string;
}
```

### Auth User

```ts
interface AuthUser {
  id:    number;
  name:  string;
  email: string;
  role:  "admin" | "client";
}
```

### Paginated Response

```ts
interface PaginatedResponse<T> {
  data:        T[];
  currentPage: number;
  perPage:     number;
  total:       number;
  lastPage:    number;
}
```

---

## Auth Flow

```
1. User submits email + password
2. Backend returns token + user profile
3. Frontend stores auth state (Zustand / Context)
4. Protected routes render based on role
5. Token sent as Bearer on every API request
```

---

## Pages

<details>
<summary><strong>Login</strong></summary>

<br/>

- Email + password form
- Validation and error handling
- Redirect to `/dashboard` on success

</details>

<details>
<summary><strong>Dashboard</strong></summary>

<br/>

**Admin:**
- Total leads · Leads by status · Recent activity · Quick create link

**Client:**
- My total leads · My leads by status · Recently updated assigned leads

</details>

<details>
<summary><strong>Leads List</strong></summary>

<br/>

- Table (desktop) / card layout (mobile)
- Search by name, email, phone, company
- Filter by status
- Sort by updated date, created date, name, status
- Pagination
- Role-aware action buttons

**Admin actions:** View · Edit · Delete · Create
**Client actions:** View assigned leads only

</details>

<details>
<summary><strong>Lead Detail</strong></summary>

<br/>

- Name, email, phone, company, status, notes, assignment, timestamps

**Admin:** Edit all fields · Delete lead
**Client:** View only · Edit `notes` and `status`

</details>

<details>
<summary><strong>Lead Create / Edit Form</strong></summary>

<br/>

**Admin fields:** Name · Email · Phone · Company · Status · Notes · Assigned client

**Client fields:** Notes · Status

</details>

---

## API Contract

```http
POST   /api/login
POST   /api/logout
GET    /api/me

GET    /api/leads
GET    /api/leads/:id
POST   /api/leads
PUT    /api/leads/:id
DELETE /api/leads/:id

GET    /api/dashboard
```

**Expectations:**
- Backend filters client-visible leads automatically
- Validation errors return structured field-level messages
- Pagination metadata included on list endpoints

---

## State Architecture

```
┌────────────────────────────────────────────────┐
│                  Auth Store                    │
│  current user · login/logout · token bootstrap │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│              TanStack Query Layer              │
│  leads list · lead detail · dashboard          │
│  create / update / delete mutations            │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│                  UI State                      │
│  filters · sort · pagination · modals          │
└────────────────────────────────────────────────┘
```

---

## Folder Structure

```
src/
├── api/
│   ├── client.ts
│   ├── auth.ts
│   ├── leads.ts
│   └── dashboard.ts
├── app/
│   ├── router.tsx
│   └── providers.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   └── leads/
├── features/
│   ├── auth/
│   ├── dashboard/
│   └── leads/
├── hooks/
├── lib/
│   ├── constants.ts
│   ├── guards.ts
│   └── utils.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── LeadsPage.tsx
│   ├── LeadDetailPage.tsx
│   ├── LeadFormPage.tsx
│   └── UnauthorizedPage.tsx
├── stores/
│   └── authStore.ts
├── types/
│   ├── auth.ts
│   └── lead.ts
└── main.tsx
```

---

## Validation Rules

| Field | Rule |
|-------|------|
| `name` | Required |
| `email` | Required · valid format |
| `phone` | Required |
| `status` | Required |
| `notes` | Optional |
| `assignedClientId` | Required for admin-created client-owned leads |

---

## Role-Based UI Rules

| Feature | Admin | Client |
|---------|-------|--------|
| Create lead button | ✅ | ❌ |
| Edit / delete actions | ✅ | ❌ |
| All records in list | ✅ | ❌ assigned only |
| Edit `notes` + `status` | ✅ | ✅ |
| Edit contact / ownership fields | ✅ | ❌ |
| Admin-only routes | ✅ | ❌ redirected |

---

## MVP Roadmap

**Phase 1 — Core**
- [ ] Login + auth flow
- [ ] Protected routes + role-aware navigation
- [ ] Leads list + lead detail
- [ ] Admin CRUD forms
- [ ] Client notes/status edit

**Phase 2 — Polish**
- [ ] Dashboard summaries
- [ ] Search · filter · sort · pagination
- [ ] Improved error, loading, and empty states

**Phase 3 — Refinement**
- [ ] Optimistic UI updates
- [ ] Reusable table and filter components
- [ ] Analytics cards

---

## Delivery Order

```
1.  Init React + Vite + TypeScript
2.  Add routing and auth shell
3.  Create API client and auth flow
4.  Implement role guards
5.  Build leads list and detail pages
6.  Build admin CRUD forms
7.  Build client limited edit flow
8.  Add dashboard
9.  Add search / filter / sort / pagination
10. Polish UI and edge states
```

---

## Open Questions

These should be confirmed with the backend owner before building:

1. Can clients create leads?
2. What exact lead fields are required?
3. How is lead ownership represented in the API response?
4. What auth mechanism is in use — Sanctum, JWT, or session cookies?
5. What does the dashboard endpoint return?
6. Are notes/status updates separate endpoints or part of `PUT /api/leads/:id`?
7. What pagination, filter, and sort query parameters does the backend support?

---

## Definition of Done

```
✦  Users authenticate successfully
✦  Admins manage all leads end to end
✦  Clients access only their assigned leads
✦  Role restrictions visible in UI and enforced in navigation
✦  List and detail flows work cleanly
✦  App works on desktop and mobile
✦  API errors, loading states, and empty states handled throughout
```

---

## 📄 License

Internal use only. Add a licence file if this becomes public.

---

<div align="center">
  <sub>Built with React · TypeScript · Vite · Tailwind</sub>
</div>
