# Proyecto-Final-DAW — Frontend

Web application for new gym users (React client).

## Contributing

Before developing, read [CONTRIBUTING.md](CONTRIBUTING.md): **required extensions** (VS Code/Cursor) and rules for your PR to pass CI.

## Prerequisites

- **Node.js v22.19+** → https://nodejs.org
- **npm v10.9+** (included with Node.js)
- **Git v2.51+** → https://git-scm.com

## Installation

```bash
git clone https://github.com/tmllabres/Proyecto-Final-DAW-client.git
cd Proyecto-Final-DAW-client
cp .env.example .env
npm install
```

On PowerShell if `cp` doesn't work:

```powershell
copy .env.example .env
```

## Run

```bash
npm run dev
```

Open in browser: http://localhost:5173

The backend must be running at http://localhost:3000 for API calls to work.

## Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/ticket-name   # o fix/ticket-name para correcciones
# work...
git add .
git commit -m "feat: change description"
git push origin feature/ticket-name
```

Open PR on GitHub → wait for approval → merge.

**Nombres de PR:** usamos **MINOR** para nuevas funcionalidades y **PATCH** para correcciones (fixes). Ejemplos: `MINOR: add login` / `PATCH: fix redirect`. Detalles en [CONTRIBUTING.md](CONTRIBUTING.md).
