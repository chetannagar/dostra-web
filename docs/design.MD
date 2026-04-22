Design a clean, modern frontend for Dostra, a lead-operations CRM connected to a Laravel API.

This is not a full sales CRM. The current product is a focused operational interface for inbound lead review and payload inspection.

Active product scope:
- Login
- Dashboard
- Leads List
- Lead Detail

Users and roles:
- Two roles exist: admin and client
- Both roles use the same overall application shell
- Role differences are light in the current UI
- Do not design a large permission matrix or heavy RBAC experience

Tech direction:
- React
- TypeScript
- Vite
- Tailwind CSS
- The final UI should be component-friendly and easy to implement with Tailwind utility classes
- Keep the design system consistent and reusable across screens

Environment:
- VITE_API_BASE_URL=http://127.0.0.1:8000/api

Actual live API usage:
- POST /api/login
- POST /api/logout
- GET /api/me
- GET /api/leads
- GET /api/leads/{id}

Current lead list query params:
- client_id
- email
- search
- from
- to
- per_page
- page

Data model:
- Auth user:
  - id
  - name
  - email
  - role: admin | client
  - clients: array of visible or assigned clients
- Lead:
  - id
  - clientId
  - clientName
  - clientKey
  - clientActive
  - name
  - email
  - message
  - source
  - webhookEventId
  - rawPayload
  - createdAt
  - updatedAt

Product tone:
- operational
- minimal
- credible
- modern
- high readability
- not generic SaaS template
- not sales-pipeline-heavy
- should feel like lead ingestion software

Brand direction:
- branded for Dostra
- restrained color palette
- strong contrast
- clean spacing
- modern typography
- minimal visual clutter
- slightly premium but still practical

Navigation and shell:
- simple left sidebar
- top bar with search and account context
- shared shell for dashboard, leads, and lead detail
- do not include client management or user management in the active live flow

Login page:
- minimal and branded
- email/password only
- no social login
- no forgot password
- no remember me
- no seed shortcut buttons
- should feel polished without adding unsupported auth features

Dashboard:
- current dashboard content is derived from visible leads already loaded in the session
- sections currently include:
  - total leads
  - new leads
  - active clients
  - reachable contacts
  - quick status view
  - top clients
  - recent leads
- important: these are lightweight summaries, not true analytics dashboards
- do not over-design advanced BI charts unless clearly presented as future-state concepts

Leads List:
- paginated list/table of inbound leads
- row selection opens lead detail
- previous/next pagination exists
- design should prioritize scanning and readability
- do not assume lead creation, bulk actions, or advanced filtering are implemented

Lead Detail:
- shows lead identity data
- shows client attribution
- shows captured message
- shows created/updated timestamps
- shows raw webhook payload JSON
- current “timeline” is only a derived display, not true backend event history
- avoid implying a full audit/event system unless clearly marked as future concept

Do not assume these features currently exist:
- full lead CRUD
- advanced bulk actions
- true event or audit timelines
- client management
- user management
- permissions editor
- forgot password
- social login
- analytics-grade reporting
- complex sales pipeline workflows

Design objective:
Create a frontend design system and screen set for the current Dostra product that feels intentional, modern, readable, and operationally focused. Optimize for the product that actually exists today, while leaving room for future expansion without making the current UI dishonest.

Implementation preference:
- Use Tailwind-friendly layout patterns
- Prefer reusable card, table, badge, sidebar, header, and form primitives
- Keep spacing, radius, shadows, and color tokens easy to map into a Tailwind design system
