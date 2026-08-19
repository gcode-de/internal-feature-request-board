# Internal Feature Request Board

Ein internes Board zum Einreichen, Diskutieren und Priorisieren von Produktideen. Die Anwendung basiert auf Next.js (App Router), TypeScript, PostgreSQL, Prisma und Tailwind CSS.

## Funktionsumfang

- persistente Requests, Kommentare, Benutzer und Sessions in PostgreSQL
- Login mit HttpOnly-Session-Cookie und gehashten Passwörtern
- Rollen für Mitarbeitende, Product Owner und Admins
- Audit Log für Status- und Prioritätswechsel
- Suche in Titel und Beschreibung, Filter nach Status/Priorität und Sortierung
- responsive Board-, Detail-, Dialog- und Login-Ansichten
- Unit-Tests mit Vitest und Browser-Tests mit Playwright
- lokaler Stack mit Docker Compose und CI über GitHub Actions

## Rollen

| Aktion                               | Mitarbeitende | Product Owner | Admin |
| ------------------------------------ | :-----------: | :-----------: | :---: |
| Requests lesen und einreichen        |       ✓       |       ✓       |   ✓   |
| Kommentare schreiben                 |       ✓       |       ✓       |   ✓   |
| Details, Status und Priorität ändern |       –       |       ✓       |   ✓   |
| Audit Log in der Oberfläche sehen    |       –       |       ✓       |   ✓   |
| Requests löschen                     |       –       |       –       |   ✓   |

Die API prüft diese Rechte serverseitig; ausgeblendete UI-Aktionen sind nicht die Sicherheitsgrenze.

## Lokale Entwicklung

Voraussetzungen: Node.js 20+, npm und PostgreSQL 16+.

```bash
cp .env.example .env
npm ci
npm run db:generate
npm run db:deploy
npm run db:seed
npm run dev
```

Die Anwendung ist anschließend unter [http://localhost:3000](http://localhost:3000) erreichbar.

Der Seed legt drei Entwicklungskonten mit dem über `SEED_PASSWORD` konfigurierten Passwort an:

- `employee@example.com`
- `owner@example.com`
- `admin@example.com`

Das Beispielpasswort darf nicht für produktive Konten verwendet werden.

## Docker Compose

```bash
docker compose up --build -d
docker compose exec app node prisma/seed.mjs
```

Der App-Container wartet auf die Datenbank und spielt ausstehende Migrationen vor dem Serverstart ein. PostgreSQL-Daten liegen im benannten Volume `postgres-data`.

```bash
docker compose logs -f app
docker compose down
```

Mit `docker compose down -v` wird zusätzlich die lokale Datenbank gelöscht.

## Qualitätssicherung

```bash
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Für den ersten lokalen Browser-Test ist einmalig `npx playwright install chromium` erforderlich. Der CI-Workflow startet PostgreSQL, migriert und seedet die Datenbank, führt Typecheck, Unit-Tests, Build und den Chromium-End-to-End-Test aus.

## Datenmodell

- `User` und `Session`: Identität, Rolle und serverseitig widerrufbare Session
- `FeatureRequest`: Titel, Beschreibung, Workflow-Status, Priorität und Ersteller
- `Comment`: Diskussion mit Autor und Zeitpunkt
- `AuditLog`: unveränderlicher Akteur, Zeitpunkt sowie Alt-/Neuwert einer Status- oder Prioritätsänderung

Schema und versionierte SQL-Migration liegen unter `prisma/`. Neue Migrationen werden lokal mit `npm run db:migrate` erzeugt und in Deployment/CI mit `npm run db:deploy` angewendet.
