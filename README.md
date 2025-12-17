# internal-feature-request-board

Domain-driven scaffold for an internal Feature Request Board. Built with Next.js (App Router, TypeScript), Tailwind CSS, and shadcn/ui-styled components.

## Vision

- Empower internal teams to collect, discuss, and prioritize feature ideas transparently.
- Provide a lightweight, opinionated workflow from idea submission to prioritized backlog.

## Assumptions

- As a POC this works without auth
- We only need English
- I can use a single dev branch instead of creating one per feature as you would in a work context

## Conscious decisions

- Ignore responsiveness for now but make shure to add later
- Mock database to save time
- Ignore auth as it was not part of the app description
- Make request description non required so you cann add quick thoughts and refine them later

## Core Domain Concepts

- FeatureRequest: a proposed idea with title, description, and context.
- Comment: discussion item attached to a FeatureRequest.
- Vote: signal of support/priority from stakeholders.
- Status: lifecycle stage (e.g., Proposed, Under Review, Planned, In Progress, Shipped, Rejected).
- Priority: product-driven ordering (e.g., P0–P3) not tied to votes alone.

## Key Use Cases

- Submit an idea with problem statement and impact.
- Discover and upvote existing ideas to avoid duplicates.
- Curate: merge duplicates, set status/priority, tag ownership and area.
- Discuss: structured comments with decision history.
- Roadmap signaling: communicate planned vs. non-planned clearly.

## Bounded Contexts (initial)

- Submission: capture, validate, and de-duplicate new requests.
- Curation: moderation, status transitions, and prioritization.
- Discovery: search, filters, tags, and vote signals.
- Communication: comments, decisions, and change logs.

## Non-Functional Requirements

- Clarity: simple flows and transparent states.
- Traceability: visible decisions and rationales.
- Maintainability: modular UI, typed code, minimal coupling.

## Tech Stack

- Next.js App Router (TypeScript)
- Tailwind CSS
- shadcn/ui-styled components (utility-first, accessible)

## Quickstart

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Lint, format, typecheck
npm run lint
npm run format
npm run typecheck

# Build for production
npm run build
npm start
```

Visit http://localhost:3000

## Roadmap / Unimplemented features

- Request model & persistence (IDs, status, priority, tags)
- Voting & de-duplication mechanics
- Curation workflows and audit trail
- Advanced discovery (search, filters, ownership)
- Improve UX: Add menu to request list to vote, edit or change properties?

## Improvements

-
