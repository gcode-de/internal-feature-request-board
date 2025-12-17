# Internal Feature Request Board

A lightweight, domain-driven tool for teams to submit, discuss, and prioritize feature ideas. Built with Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui.

## Getting Started

```bash
npm install
npm run dev        # Start dev server (http://localhost:3000)
npm run lint       # TypeScript + ESLint
npm run build      # Production build
```

## Architecture

**Core Concepts**

- FeatureRequest: title, description, status, priority, comments
- Status: Proposed → Under Review → Planned → In Progress → Shipped / Rejected
- Priority: P0–P3
- Comment: discussion thread attached to requests

**Bounded Contexts**

- Submission: create and validate requests (description optional)
- Curation: edit status/priority via modal form
- Discovery: list view with comment counter
- Discussion: add comments to requests

## Key Decisions

✅ **In-Memory Database** - No Prisma/DB setup; data resets on /restart  
✅ **No Authentication** - Single internal team, no user tracking  
✅ **Description Optional** - Encourage quick submissions, refine later  
✅ **Comments as Request Property** - No separate table; simple data model  
✅ **Form Validation** - Real-time feedback with touched-state tracking

## Not Implemented (Yet)

- Voting / de-duplication
- Search, sort & filters
- Audit trail / decision history
- User authentication & roles
- Responsive mobile design
- Database persistence

## Roadmap

- [ ] Add database (Prisma + PostgreSQL)
- [ ] Voting system
- [ ] Advanced search/filters
- [ ] User roles & audit trail
