# Development Log

## 2026-04-26: Lightweight admin configuration retrofit

Goal: keep Luxirty Search lightweight while adding minimal backend configuration for Google PSE/CSE, single-admin login, SQLite persistence, and a shadcn-vue-style admin UI.

Repository path: `/Users/joeyang/Documents/Projects/jkg-search`

### Constraints

- Keep Vue 3 + Vite + Vue Router.
- Keep Google Programmable Search Element as the primary search implementation.
- Do not introduce SearXNG.
- Do not use DuckDuckGo as a full search replacement; only optional Instant Answer API support is allowed.
- Avoid heavyweight frameworks and ORMs.
- Do not store passwords in plaintext.
- Do not store sessions in localStorage.

### Stage Commits

- `400ace1` Add lightweight Node SQLite API
- `bb05f9c` Load Google PSE config at runtime
- `f64ddc1` Add admin login and settings UI
- `f6a7639` Document admin configuration workflow

### Backend

Added `server/` with Hono and `better-sqlite3`.

Key files:

- `server/index.js`: Hono app, API routes, static `dist` serving for production.
- `server/db.js`: SQLite initialization, schema, settings/session/user helpers.
- `server/auth.js`: session id generation, cookie parsing/serialization, auth middleware.
- `server/config.js`: `.env` loading and runtime config.
- `server/scripts/init-admin.js`: one-time admin creation from `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

Tables:

- `users`: single admin-capable user table with bcrypt password hash.
- `settings`: runtime key/value settings.
- `search_providers`: lightweight provider metadata.
- `sessions`: server-side sessions keyed by httpOnly cookie.

Main API routes:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/settings/google-pse`
- `GET /api/settings`
- `PUT /api/settings`
- `PUT /api/settings/google-pse`
- `GET /api/ddg?q=...`

Security notes:

- Password hashing uses `bcryptjs`.
- Session cookie is `HttpOnly; SameSite=Lax`.
- `Secure` cookies default on in production, configurable with `COOKIE_SECURE`.
- Admin APIs use auth middleware.
- No open registration.
- No hardcoded default password.

### Frontend

Google PSE loading no longer depends only on compile-time `VITE_GOOGLE_CSE_CX`.

Key files:

- `src/lib/settings.js`: fetches `/api/settings/google-pse`, falling back to `import.meta.env.VITE_GOOGLE_CSE_CX`.
- `src/lib/google-cse.js`: dynamic Google CSE script loader and reset/render helpers.
- `src/components/Home.vue`: loads runtime cx and site title before loading CSE searchbox.
- `src/components/Results.vue`: loads runtime cx, preserves rendered callback that strips `data-cturl` and `data-ctorig`.

Admin/auth UI:

- `src/components/Login.vue`
- `src/components/Admin.vue`
- `src/components/AdminSettings.vue`
- `src/router/index.js`: adds `/login`, `/admin`, `/admin/settings` and route guard via `/api/auth/me`.

shadcn-vue-style local components:

- `src/components/ui/Button.vue`
- `src/components/ui/Input.vue`
- `src/components/ui/Card.vue`
- `src/components/ui/Tabs*.vue`
- `src/components/ui/Dialog*.vue`
- `src/components/ui/Switch.vue`
- `src/components/ui/Table.vue`
- `src/components/ui/Toast.vue`

Implementation style: local copied components using Radix Vue primitives, `class-variance-authority`, `clsx`, and `tailwind-merge`; no global state manager added.

### Runtime Settings

Minimum settings implemented:

- `google_pse_cx`
- `site_title`
- `duckduckgo_enabled`

Behavior:

- Search pages call `/api/settings/google-pse`.
- If SQLite has no `google_pse_cx`, frontend falls back to `VITE_GOOGLE_CSE_CX`.
- Admin settings save to SQLite and take effect without rebuild on next page load.
- DuckDuckGo endpoint is disabled unless `duckduckgo_enabled` is true and uses the Instant Answer API only.

### Scripts and Deployment

`package.json` now includes:

- `pnpm dev`: starts Node API and Vite dev server together.
- `pnpm dev:api`
- `pnpm dev:web`
- `pnpm build`
- `pnpm start`
- `pnpm init:admin`

Vite proxies `/api` to `http://localhost:8787` in development.

Dockerfile now builds the Vite app and runs `node server/index.js`, serving both API and `dist`.

Local runtime data:

- Default SQLite path: `./data/app.sqlite`
- `data/` is ignored by git and Docker context.

### Verification

Completed checks:

- `pnpm build` passed.
- `node --check server/index.js` passed.
- `node --check scripts/dev.js` passed.
- API end-to-end check with temporary `DATA_DIR`:
  - unauthenticated `/api/settings` returned `401`
  - admin login succeeded
  - login set session cookie
  - authenticated settings update succeeded
  - `/api/settings/google-pse` returned the updated runtime cx
- `git diff --check` passed before staged commits.

Ignored local outputs after verification:

- `data/`
- `dist/`
- `node_modules/`

### Useful Commands

```sh
pnpm install
ADMIN_USERNAME=admin ADMIN_PASSWORD=change-me-please pnpm init:admin
pnpm dev
pnpm build
pnpm start
```

Production over plain HTTP testing:

```sh
COOKIE_SECURE=false pnpm start
```

### Follow-up Notes

- README has been updated with initialization, Google PSE CX configuration, dev startup, production startup, Docker, and DuckDuckGo limitations.
- `.env` was already tracked in the original repo. Do not accidentally commit real secrets there.
- If future work needs current context, read this file first.

## 2026-04-26: Public search UI shadcn alignment

Goal: make the public search experience match the admin shadcn-style design system while keeping search usable without login.

Changes:

- `src/components/Home.vue` now uses local shadcn-style `Button` and `Card` components.
- `src/components/Results.vue` now uses the same public shell, `Button`, and `Card` components.
- Public search routes remain unauthenticated:
  - `/`
  - `/search`
- Admin routes remain the only guarded routes:
  - `/admin`
  - `/admin/settings`
- Google PSE Element containers are preserved:
  - `.gcse-searchbox-only` on home
  - `.gcse-searchbox` and `.gcse-searchresults` on results
- `src/assets/main.css` updates Google CSE input, button, and result card styling to use shadcn design tokens such as `--background`, `--foreground`, `--card`, `--border`, `--input`, `--primary`, and `--ring`.

Verification:

- `pnpm build` passed after the UI changes.
- `git diff --check` passed.
