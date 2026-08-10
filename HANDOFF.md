# EECA Lung Health Sovereignty Hub — Project Handoff

> Read this first when joining or resuming work. Then verify against `git log`
> and the live site — this doc reflects state as of **2026-08-10**.

## Project identity
- **What:** EECA Lung Health "Sovereignty Hub" — marketing site + consultation platform.
- **Live domain:** `https://eecalunghealth.com` (current production domain).
- **Old domain (legacy):** `sovereigntyhub.innovations4health.org` — being retired.
- **Repo:** `github.com/IndiasFernandes/Sovereignty-Hub` (private). Branches:
  `main` = stable/deployed, `dev` = working. As of this doc, both point at the
  same commit (`0f001c7`) — fully in sync, nothing pending merge.
- **Live app lives in `web/`** (React + Vite + TypeScript). Root-level `index.html`
  etc. are the FROZEN legacy static site — do not develop there.

## Backend truth (IMPORTANT)
- **Active backend = PHP + MySQL.** Frontend calls PHP endpoints via
  `web/src/lib/api.ts` → `submit.php`, `login.php`, `responses.php`, etc.
  Deploy/setup documented in `web/DEPLOY.md`.
- **Supabase is DEAD.** `web/supabase/` (migration `001_consultation_responses.sql`
  + edge function `notify-submission`) was SUPERSEDED by the MySQL backend and is
  NOT wired to anything. Candidate for deletion/cleanup — confirm before removing.

## Deploy mechanism
- **CI is the live path:** `.github/workflows/deploy.yml`, build + rsync-over-SSH
  to `eecalunghealth.com`. Manual dispatch only (push auto-deploy is commented out):
  ```
  gh workflow run deploy.yml --ref main
  gh run list --workflow=deploy.yml --limit 3   # confirm it went green
  ```
  Requires `DEPLOY_SSH_KEY/HOST/USER/PORT/DEPLOY_PATH` GitHub secrets (already set).
- Manual FTP of `web/dist/` (see `web/DEPLOY.md`) is the fallback/historical path.
- Never overwrite server files `api/config.php` or `api/uploads/` on deploy.

## What shipped recently (now live on main, deployed)
- **Funder front door:** `/for-funders`, `/concept-note` (+ downloadable PDF via
  `web/scripts/build-pdf.sh`), `/governance/financials`, `BriefingCTA` component,
  new nav entry.
- **Home + site-wide:** hero + funder-impact block, cost-of-inaction stat cards,
  site-wide CTA hierarchy, `TrustStrip` above footer, funder tiers (`TierGrid`),
  short funder-fit funnel (`FunderFitPage`), `UseOfFundsChart`.
- **Consultation form:** locked EN/RU questionnaire changes, mobile nav CTA moved
  into the drawer, public budget figures removed → "Available on request" CTA.
- **Platform dashboard images:** regenerated to v2 brand-aligned mockups (all 6
  files in `web/public/assets/images/platform/`), prompts rewritten as one
  coherent design system in `platform-image-prompts.md`.
- **i18n:** language auto-detect, team LinkedIn links, footer governance line.

## Open tasks
1. **Admin credentials.** The `admin_users` table (PHP/MySQL) currently has one
   row: `id=1, username=admin`. Plan in progress: rename that row to a personal
   owner account (`indias`) and add a second full-access row for `jonas` (no
   roles in this schema — any row = full admin panel access). A script,
   `admin-setup-RUN-ME-YOURSELF.sh` (repo root, **untracked, not committed** —
   it stages production credentials and should stay out of git), does this.
   It must be run by the account owner directly in their own terminal, not by
   an AI session — printing/generating live production passwords through an AI
   tool call is a hard-blocked action in this environment (by design).
2. **Jonas's access.** Needs: (a) GitHub collaborator invite (write access) on
   this repo, (b) his own Claude Code account with the GitHub connector
   authorized against his own GitHub login, (c) the `jonas` admin panel login
   from task 1. He does NOT need the SSH deploy key or `~/.innerflect/credentials.env`
   — deploys go through `gh workflow run`, which only needs GitHub permissions.
3. **Review the admin panel** — go through outstanding consultation submissions
   at `/admin/login`.

## Reconnecting on a new machine
- Log into Claude Code with the Anthropic account **hello@innerflect.tech** (owner)
  or your own account with repo access (collaborators) so the GitHub connector
  attaches correctly.
- Copy these secrets securely (NOT via git) — owner only:
  - `~/.innerflect/credentials.env`
  - any `web/.env` / `.env.local`
  - `web/api/config.php` is server-only; not needed locally.
- `cd web && npm install && npm run dev` to run locally.
- Verify MCPs with `/mcp`.

## Notes
- No vault SSOT exists for this project (unlike Essência). Git history + this
  file are the record — keep this file current when picking up new work.
