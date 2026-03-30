# strapi-julius-editor — agent notes

## Git commits

- Keep **commit messages short**: prefer a single subject line, about **≤ ~50 characters** when practical (avoid long subjects).
- Use **English**, **lowercase**, clear wording; add a brief body only when the change is not obvious.

## Package manager

This package is developed with **pnpm** (see `packageManager` in `package.json`). Use Node **24.14.1+** on the 24.x line (`.nvmrc`).

## Verifying changes in Strapi (consumer: `julius-cms`)

The admin runs in the **`julius-cms`** app, not in this package alone.

1. **Always** confirm behavior in the Strapi admin with a **browser** (MCP browser on localhost or an explicit user check). Do not stop after editing only files in this repo.
2. After changing admin code here, the consumer must clear Strapi’s Vite dependency cache or the UI can stay stale: from `julius-cms`, `rm -rf node_modules/.strapi` then `pnpm dev`, or **`pnpm dev:fresh`**.
3. Full workflow, credentials (localhost only), and draft vs published checks: **`julius-cms/.agents/skills/strapi-julius-editor-verify-in-admin/SKILL.md`** (path relative to the `julius-cms` repository root).
