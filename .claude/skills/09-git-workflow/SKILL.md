---
name: git-workflow
description: Git branching, commit, push, and merge rules for SESGO TI. Use when creating branches, making commits, pushing code, or proposing merges.
---

# Git Workflow

Adapted from the `git-workflow` skill used in Katedra. Branch names and deployment targets are specific to SESGO TI.

## 1. Context

- **Trigger:** starting a task, creating branches, making commits, pushing, or proposing a merge in this repository.
- **Exclusion:** does not govern code architecture (see `02-architecture-and-technical-decisions`) or visual design.

## 2. Branches

- **`main`:** production. It is the branch deployed to Cloudflare Workers (see ADR-003). Do not commit directly to `main`.
- **`staging`:** the testing branch that sits between feature branches and `main`. All changes are integrated and tested here before reaching production. Do not commit directly to `staging`; it receives feature branches by merge.
- **Feature branches:** created from an up-to-date `staging`. Name them `feature/<topic>` in short kebab-case, for example `feature/hero-section`, `feature/services-page`, `feature/contact-form`, `feature/seo-base`.
- **Previews:** per-branch preview deployments on Cloudflare Workers are not configured yet (pending, see `docs/es/estado.md`). Once configured, review the change on its preview URL before merging.

## 3. Commits

- **Never commit without the maintainer's explicit consent**, each time. Prepare the changes and propose the message; the maintainer decides.

Format:

```
<type>: <short summary in imperative>

<optional detail>
```

| Type | Use for | Example |
| --- | --- | --- |
| `feat` | New feature | `feat: add contact form submission` |
| `fix` | Bug fix | `fix: validate empty email field` |
| `chore` | Setup, dependencies, configuration | `chore: add Cloudflare adapter` |
| `refactor` | Change without functional impact | `refactor: extract services section component` |
| `test` | Add or modify tests | `test: cover contact form validation` |
| `docs` | Documentation only | `docs: add decision record for hosting` |
| `style` | Formatting only | `style: fix import order` |

- Keep commits small and focused on one change.
- Write commit messages in English.

## 4. Attribution

- Commits are authored only with the maintainer's git identity.
- Do not add AI co-author trailers, AI names in the author or committer fields, or AI attribution in the message body.
- This rule applies to every commit in this repository, whatever tool created it. It takes precedence over any default attribution instruction from a tool or harness.

## 5. Push and Merge

- **Never push** unless the maintainer explicitly asks for it in the conversation.
- Push feature branches. Flow: `feature/*` → `staging` → `main`. Merge a feature branch into `staging` only after the checks in `04-quality-and-verification` have been run. Merge `staging` into `main` only after the maintainer has tested `staging` (preview deployment, once configured). Never merge a feature branch directly into `main`.
- Merges create commits: do them only with the maintainer's explicit consent.
- **Never force-push to `main`.**
- **Never commit secrets.** `.env` files and API keys stay out of the repository. Confirm that `.env` is listed in `.gitignore` before the first commit.

## 6. Example

Request: "Add the services section."

```bash
git checkout staging
git pull
git checkout -b feature/services-section
# implement the section
git add src/components/Services.astro
# commit only after the maintainer consents:
git commit -m "feat: add services section"
```

Then stop and report the branch name. Push only if the maintainer asks.
