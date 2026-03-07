# Contributing Guide

## Required extensions (VS Code / Cursor)

To work on this project you **must install** the workspace-recommended extensions. When you open the repo, the editor will prompt you; install all of them from "Workspace Recommended".

If you don't install them, you won't see ESLint/Prettier errors in real time and your commits are more likely to fail in CI.

**Required list:**

- Auto Rename Tag
- Code Spell Checker
- Code Spell Checker (Spanish)
- Error Lens
- ES7+ React/Redux/React-Native snippets
- ESLint
- GitHub Actions
- Path Intellisense
- Prettier
- Tailwind CSS IntelliSense

**How to install:** Extensions panel → **"Workspace Recommended"** tab → Install All.

---

## CI checks

Every push and every PR run:

- **ESLint** (no warnings allowed)
- **TypeScript** (`tsc --noEmit`)
- **Prettier** (format check)
- **Build** (`npm run build`)

**PRs cannot be merged if CI fails.** Even without the extensions, your code must pass these checks; the extensions help you meet them before pushing.

---

## Naming PRs: MINOR vs PATCH

We use **MINOR** and **PATCH** in PR titles (and optionally in branch names) to distinguish the type of change:

| Prefix    | Use         | Example                      |
| --------- | ----------- | ---------------------------- |
| **MINOR** | New feature | `MINOR: add user login form` |
| **PATCH** | Fix, bugfix | `PATCH: fix login redirect`  |

- **MINOR** → changes that add new behaviour (features).
- **PATCH** → changes that fix bugs or adjust something existing (fixes).

Example PR titles: `MINOR: description` or `PATCH: description`.

---

## Merge policy (mandatory)

We don't use GitHub branch protection (org limits). **You must follow this manually:**

1. **Do not merge** while CI or Security checks are still running or have failed. Wait until all workflows are green.
2. **One approval is enough** — you need exactly one approval from **someone else** (a teammate). The list in [.github/REVIEWERS](.github/REVIEWERS) is who gets requested; any one of them can approve.
3. **You cannot approve your own PR.** If you opened the PR, you must wait for one of your colleagues to approve it. Only after that can the PR be merged (by you or by them).

Whoever merges is responsible for ensuring all conditions are met.

---

## Before pushing

```bash
npm run lint
npm run build
```

Or format everything:

```bash
npm run format
npm run lint -- --fix
```
