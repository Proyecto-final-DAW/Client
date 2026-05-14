# Proyecto-Final-DAW — Frontend

Web application for new gym users (React client).

## Contributing

Before developing, read [CONTRIBUTING.md](CONTRIBUTING.md): **required extensions** (VS Code/Cursor) and rules for your PR to pass CI.

## Prerequisites

- **Node.js v22.19+** → https://nodejs.org
- **pnpm** (e.g. `corepack enable && corepack prepare pnpm@latest --activate`, or https://pnpm.io/installation)
- **Git v2.51+** → https://git-scm.com

## Installation

```bash
git clone https://github.com/tmllabres/Proyecto-Final-DAW-client.git
cd Proyecto-Final-DAW-client
cp .env.example .env
pnpm install
```

On PowerShell if `cp` doesn't work:

```powershell
copy .env.example .env
```

## Run

```bash
pnpm dev
```

Open in browser: http://localhost:5173

The backend must be running at http://localhost:3000 for API calls to work.

## Workflow

```bash
git checkout develop
git pull origin develop
git checkout -b feature/ticket-name
git add .
git commit -m "feat: change description"
git push origin feature/ticket-name
```

Open PR on GitHub → wait for approval → merge.
