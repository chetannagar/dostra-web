# React Frontend API Integration Guide

This document maps exactly how the React frontend should authenticate against and consume the current Dostra API.

## Base URL

Local development:

```text
http://127.0.0.1:8000/api
```

All examples below assume requests are made against that base URL.

## Authentication Model

The React frontend should use bearer-token authentication with Sanctum personal access tokens.

The webhook endpoint is not used by the React frontend. It is only used by Zapier or other server-to-server callers.

## Login Flow

### 1. Login request

```http
POST /api/login
Content-Type: application/json
Accept: application/json
```

Body:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

### 2. Login response

```json
{
  "token": "plain-text-token",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "clients": []
  }
}
```

### 3. Store auth state

Store:

- `token`
- `user`

Recommended pragmatic approach:

- keep auth in React state
- optionally persist token in `localStorage` if you want session restore

### 4. Send bearer token on all authenticated requests

```http
Authorization: Bearer <token>
Accept: application/json
```

### 5. Restore session on app boot

If a token exists locally, call:

```http
GET /api/me
```

Behavior:

- `200`: token is valid, hydrate auth state
- `401`: token is invalid or expired, clear local auth and redirect to login

### 6. Logout

```http
POST /api/logout
Authorization: Bearer <token>
```

After logout:

- clear token
- clear user state
- redirect to login

## Suggested React Auth Types

```ts
type ClientSummary = {
  id: number;
  name: string;
  client_key: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'client';
  clients: ClientSummary[];
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};
```

## Role-Based Frontend Behavior

Use `user.role` to decide layout and available screens.

### Admin user

Should be able to access:

- dashboard
- all clients
- all users
- all leads
- client creation/editing
- user creation/editing
- webhook secret rotation

### Client user

Should be able to access:

- dashboard
- assigned clients only
- assigned leads only

Should not see:

- global user management
- global client management controls
- other clients' leads

The API already enforces this server-side.

## API Client Wrapper

Use one shared API wrapper.

Example:

```ts
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    throw new Error('Unauthenticated');
  }

  if (! response.ok) {
    const body = await response.json().catch(() => null);
    throw { status: response.status, body };
  }

  return response.json();
}
```

## Endpoint-by-Endpoint Frontend Usage

## 1. `POST /api/login`

Purpose:

- login form submit

Request:

```json
{
  "email": "client@example.com",
  "password": "password"
}
```

React behavior:

- call on form submit
- store returned `token`
- store returned `user`
- redirect based on `user.role`

Error handling:

- `422`: invalid credentials
- `429`: too many login attempts

## 2. `GET /api/me`

Purpose:

- session restore on app boot
- fetch latest authenticated user state

React behavior:

- call when app loads if a token exists
- use this response as the source of truth for current role and assigned clients

## 3. `POST /api/logout`

Purpose:

- revoke current token

React behavior:

- call when user clicks logout
- clear local auth state even if request fails

## 4. `GET /api/clients`

Purpose:

- client list page
- tenant selector
- client summary views

Behavior:

- admin sees all clients
- client user sees only assigned clients

React usage:

- admin clients table
- client account view
- admin lead filters

## 5. `GET /api/clients/{client}`

Purpose:

- client detail page

Behavior:

- admin can open any client
- client user can open only assigned clients

React usage:

- client detail panel/page
- admin client settings page

Error handling:

- `403`: forbidden
- `404`: not found

## 6. `POST /api/clients`

Purpose:

- admin-only client creation

Example request:

```json
{
  "name": "Acme Plumbing",
  "client_key": "acme_plumbing",
  "is_active": true
}
```

Optional manual secret:

```json
{
  "name": "Acme Plumbing",
  "client_key": "acme_plumbing",
  "is_active": true,
  "webhook_secret": "super-secret-value-12345678901234567890"
}
```

React usage:

- admin create-client modal/page

Expected response:

- `201 Created`

## 7. `PUT /api/clients/{client}`

Purpose:

- admin-only client editing

Use for:

- updating `name`
- updating `client_key`
- toggling `is_active`
- manually replacing `webhook_secret`

Example request:

```json
{
  "name": "Acme Plumbing AU",
  "is_active": false
}
```

## 8. `POST /api/clients/{client}/rotate-webhook-secret`

Purpose:

- admin-only secret rotation

Behavior:

- rotates `webhook_secret`
- returns the new secret once

React usage:

- show confirmation modal
- after success, show returned secret to admin
- warn that it must be copied and updated in Zapier

Important:

- normal client responses do not expose `webhook_secret`
- only this endpoint returns the new secret

## 9. `GET /api/users`

Purpose:

- admin-only user management list

Response includes:

- user details
- assigned clients

React usage:

- admin users page
- role badges
- client assignments display

## 10. `GET /api/users/{user}`

Purpose:

- admin-only user detail page

React usage:

- edit form prefill
- user detail view

## 11. `POST /api/users`

Purpose:

- admin-only user creation

### Create client user

```json
{
  "name": "Client User",
  "email": "client@example.com",
  "password": "password123",
  "role": "client",
  "client_ids": [1, 2]
}
```

### Create admin user

```json
{
  "name": "Ops Admin",
  "email": "ops@example.com",
  "password": "password123",
  "role": "admin"
}
```

React behavior:

- if role is `client`, show client assignment multi-select
- if role is `admin`, hide or clear client assignments

Expected response:

- `201 Created`

## 12. `PUT /api/users/{user}`

Purpose:

- admin-only user editing

Use for:

- changing name
- changing email
- resetting password
- changing role
- syncing assigned clients

Example request:

```json
{
  "name": "Updated Client User",
  "role": "client",
  "client_ids": [2]
}
```

Frontend behavior:

- if changing to `admin`, clear client assignments
- if changing to `client`, allow selecting assigned clients

## 13. `GET /api/leads`

Purpose:

- main CRM leads table

Behavior:

- admin sees all leads
- client user sees only leads for assigned clients
- response is paginated

Supported query parameters:

- `client_id`
- `email`
- `search`
- `from`
- `to`
- `per_page`

Examples:

```text
/api/leads?per_page=25
/api/leads?client_id=1
/api/leads?email=john@example.com
/api/leads?search=quote
/api/leads?from=2026-03-01&to=2026-03-31
```

Recommended React state:

```ts
type LeadFilters = {
  client_id?: number;
  email?: string;
  search?: string;
  from?: string;
  to?: string;
  per_page?: number;
  page?: number;
};
```

Expected response shape:

```ts
type Lead = {
  id: number;
  client_id: number;
  name: string | null;
  email: string | null;
  message: string | null;
  source: string | null;
  webhook_event_id: string | null;
  raw_payload: Record<string, unknown> | null;
  client: ClientSummary;
  created_at: string;
  updated_at: string;
};

type LeadListResponse = {
  data: Lead[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
};
```

React usage:

- leads table
- search/filter toolbar
- pagination controls

## 14. `GET /api/leads/{lead}`

Purpose:

- lead detail page or drawer

Behavior:

- admin can view any lead
- client user can only view leads belonging to assigned clients

React usage:

- lead detail panel
- CRM lead detail page

Error handling:

- `403`: forbidden
- `404`: not found

## 15. `POST /api/webhook/leads`

Purpose:

- Zapier/server-to-server only

The React frontend should not call this endpoint.

Use the frontend only to:

- display `client_key`
- let admins rotate webhook secrets
- display integration instructions

## Webhook Contract for Admin UI

When you build the admin integration help screen, document this:

Required headers:

- `X-Client-Key`
- `X-Webhook-Id`
- `X-Webhook-Timestamp`
- `X-Webhook-Signature`

Signature formula:

```text
hash_hmac('sha256', <timestamp>.<raw_json_body>, <client_webhook_secret>)
```

Webhook guarantees:

- client validation
- timestamp freshness
- idempotency by event id

## Suggested Frontend Pages

### Shared

- `/login`
- `/dashboard`

### Admin

- `/clients`
- `/clients/:id`
- `/users`
- `/users/:id`
- `/leads`
- `/leads/:id`

### Client

- `/account` or `/clients`
- `/leads`
- `/leads/:id`

## Suggested Frontend Data Flow

### App boot

1. read token from storage
2. if token exists, call `GET /api/me`
3. if valid, hydrate auth state
4. if invalid, clear token and redirect to login

### Login page

1. submit credentials to `POST /api/login`
2. store token and user
3. redirect to dashboard

### Leads page

1. build query string from filters
2. call `GET /api/leads?...`
3. render `data`
4. render pagination from `meta`

### Admin user form

1. call `GET /api/clients` to populate client selector
2. submit to `POST /api/users` or `PUT /api/users/{user}`

### Admin client settings

1. call `GET /api/clients/{client}`
2. update with `PUT /api/clients/{client}`
3. rotate secret with `POST /api/clients/{client}/rotate-webhook-secret`

## Error Handling Map

### `401 Unauthorized`

Meaning:

- missing token
- invalid token
- revoked token
- expired or invalid CRM session

Frontend action:

- clear auth state
- redirect to login

### `403 Forbidden`

Meaning:

- user is authenticated but not allowed to access that resource

Frontend action:

- show forbidden message or route to a forbidden page

### `422 Unprocessable Entity`

Meaning:

- validation error
- invalid login credentials

Frontend action:

- show form errors

### `429 Too Many Requests`

Meaning:

- login rate limit hit
- webhook rate limit hit
- CRM API rate limit hit

Frontend action:

- show retry-later message

## What the Frontend Should Not Do

Do not:

- call the webhook endpoint from the browser
- implement webhook signing in React
- expose webhook secrets outside admin secret-rotation flows
- rely on frontend UI hiding as the only access control layer

## Recommended Implementation Order

1. build login page using `POST /api/login`
2. build auth bootstrap using `GET /api/me`
3. add React route guards
4. build leads list using `GET /api/leads`
5. build lead detail using `GET /api/leads/{lead}`
6. build clients list/detail
7. build admin user management
8. build admin client management and webhook secret rotation

## Environment Variables for React

Recommended frontend env:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Local Seeded Credentials

Local development seeds:

- admin user:
  - `admin@example.com`
  - `password`

- client user:
  - `client@example.com`
  - `password`

Use these for initial frontend integration and testing.
