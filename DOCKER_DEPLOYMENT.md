# Docker Deployment

## Lokaler Stack

`compose.yaml` startet PostgreSQL 16 und das gebaute Next.js-Image. Der App-Container führt vor jedem Start `prisma migrate deploy` aus.

```bash
docker compose up --build -d
docker compose exec app node prisma/seed.mjs
docker compose logs -f app
```

Die Beispieldaten sind nur für Entwicklung gedacht. In einer produktiven Umgebung werden Benutzer über einen kontrollierten Provisionierungsprozess angelegt und `SESSION_COOKIE_SECURE=true` gesetzt.

## Einzelnes Image

```bash
docker build -t internal-feature-request-board:local .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL='postgresql://user:password@database:5432/featureboard?schema=public' \
  -e SESSION_COOKIE_SECURE=true \
  internal-feature-request-board:local
```

Die in `DATABASE_URL` angegebene Datenbank muss vom Container erreichbar sein. Daten werden ausschließlich in PostgreSQL gespeichert; ein Dateisystem-Volume am App-Container ist nicht erforderlich.

## GitHub Actions

- `.github/workflows/ci.yml` prüft Pull Requests und Pushes auf `main` mit PostgreSQL, Typecheck, Vitest, Produktions-Build und Playwright.
- `.github/workflows/docker-publish.yml` baut und veröffentlicht auf `main` das Image. Dafür müssen die im Workflow referenzierten Docker-Registry-Secrets gesetzt sein.

Vor einem öffentlichen Deployment sollten Image-Tags, Registry, TLS-Terminierung, Backups, Secret-Verwaltung und der Benutzer-Provisionierungsprozess an die Zielumgebung angepasst werden.
