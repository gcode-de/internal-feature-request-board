# Docker Deployment Guide

Dieses Dokument beschreibt, wie Sie dieses Next.js-Projekt mit Docker und GitHub Actions deployen.

## Voraussetzungen

1. **Docker Hub Account** (oder GitHub Container Registry)
2. **GitHub Repository** mit Push-Zugriff
3. **Lokale Docker Installation** für Tests und lokales Deployment

## GitHub Secrets einrichten

Navigieren Sie zu Ihrem GitHub Repository → Settings → Secrets and variables → Actions:

Fügen Sie folgende Secrets hinzu:

- `DOCKER_USERNAME`: Ihr Docker Hub Benutzername
- `DOCKER_PASSWORD`: Ihr Docker Hub Token/Password

**Docker Hub Token erstellen:**

1. Gehen Sie zu [Docker Hub](https://hub.docker.com/)
2. Account Settings → Security → New Access Token
3. Token kopieren und als `DOCKER_PASSWORD` Secret hinterlegen

## Automatisches Deployment via GitHub Actions

Der Workflow in `.github/workflows/docker-publish.yml` wird automatisch ausgelöst bei:

- **Push auf main Branch**: Baut und pushed das Docker Image
- **Manueller Trigger**: Über GitHub Actions UI

### Image-Tagging-Strategie:

- `latest`: Aktuellster Build vom main Branch
- `main-<sha>`: Spezifischer Commit
- `main`: Branch-spezifischer Tag

## Lokales Testen

### Docker Image lokal bauen:

```bash
docker build -t internal-feature-request-board:local .
```

### Image lokal starten:

```bash
docker run -p 3000:3000 internal-feature-request-board:local
```

Anwendung ist verfügbar unter: http://localhost:3000

## Deployment auf lokaler Docker-Instanz

### 1. Image von Docker Hub pullen:

```bash
docker pull <DOCKER_USERNAME>/internal-feature-request-board:latest
```

Beispiel:

```bash
docker pull gcode/internal-feature-request-board:latest
```

### 2. Container starten:

```bash
docker run -d \
  --name feature-request-board \
  -p 3000:3000 \
  --restart unless-stopped \
  <DOCKER_USERNAME>/internal-feature-request-board:latest
```

**Optionen:**

- `-d`: Container im Hintergrund laufen lassen
- `--name`: Name für den Container
- `-p 3000:3000`: Port-Mapping (Host:Container)
- `--restart unless-stopped`: Automatischer Neustart bei Systemstart

### 3. Container-Status prüfen:

```bash
docker ps
```

### 4. Logs anzeigen:

```bash
docker logs feature-request-board
docker logs -f feature-request-board  # Follow mode
```

### 5. Container stoppen/starten/neu starten:

```bash
docker stop feature-request-board
docker start feature-request-board
docker restart feature-request-board
```

### 6. Container entfernen:

```bash
docker stop feature-request-board
docker rm feature-request-board
```

## Aktualisierung auf neue Version

```bash
# Neues Image pullen
docker pull <DOCKER_USERNAME>/internal-feature-request-board:latest

# Alten Container stoppen und entfernen
docker stop feature-request-board
docker rm feature-request-board

# Neuen Container mit aktueller Version starten
docker run -d \
  --name feature-request-board \
  -p 3000:3000 \
  --restart unless-stopped \
  <DOCKER_USERNAME>/internal-feature-request-board:latest
```

## Docker Compose (Alternative)

Erstellen Sie eine `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    image: <DOCKER_USERNAME>/internal-feature-request-board:latest
    container_name: feature-request-board
    ports:
      - "3000:3000"
    restart: unless-stopped
```

**Starten:**

```bash
docker-compose up -d
```

**Stoppen:**

```bash
docker-compose down
```

**Update:**

```bash
docker-compose pull
docker-compose up -d
```

## Produktions-Überlegungen

### Umgebungsvariablen

Falls Sie Umgebungsvariablen benötigen:

```bash
docker run -d \
  --name feature-request-board \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_URL=https://api.example.com \
  --restart unless-stopped \
  <DOCKER_USERNAME>/internal-feature-request-board:latest
```

Oder mit `.env` Datei:

```bash
docker run -d \
  --name feature-request-board \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  <DOCKER_USERNAME>/internal-feature-request-board:latest
```

### Volumes für persistente Daten

Falls Sie Daten persistent speichern möchten:

```bash
docker run -d \
  --name feature-request-board \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  <DOCKER_USERNAME>/internal-feature-request-board:latest
```

### Reverse Proxy (nginx/traefik)

Für Produktionsumgebungen empfiehlt sich ein Reverse Proxy:

**nginx Beispiel:**

```nginx
server {
    listen 80;
    server_name feature-requests.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Container startet nicht:

```bash
docker logs feature-request-board
```

### Port bereits belegt:

```bash
# Anderen Port verwenden
docker run -p 3001:3000 ...
```

### Image-Größe reduzieren:

Das Dockerfile verwendet bereits Multi-Stage Builds für optimale Image-Größe.

### Build-Cache löschen:

```bash
docker builder prune
```

## Monitoring

### Container-Ressourcen überwachen:

```bash
docker stats feature-request-board
```

### Detaillierte Container-Info:

```bash
docker inspect feature-request-board
```

## Weitere Ressourcen

- [Next.js Docker Dokumentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Hub](https://hub.docker.com/)
- [GitHub Actions Dokumentation](https://docs.github.com/en/actions)
