# Running Juanet on a VPS with CloudPanel (Supabase backend)

This guide deploys **Juanet – Software Command Center** (TanStack Start + React 19 + Vite 7)
on your own VPS behind CloudPanel, using your existing **Supabase** project as the database/auth.

CloudPanel serves the app through its Node.js site type (Nginx reverse-proxy → Node process).

---

## 1. Prerequisites

- A VPS with **CloudPanel v2** installed (Debian 12 / Ubuntu 22.04+)
- A domain or subdomain pointing to the VPS (e.g. `app.juanet.com`)
- Your Supabase project URL + keys (Dashboard → Project Settings → API)
- Git access to this repository

---

## 2. Create the site in CloudPanel

1. CloudPanel → **Sites → Add Site → Create a Node.js Site**
2. Fill in:
   - **Domain Name**: `app.juanet.com`
   - **Node.js Version**: `22` (or `20`)
   - **App Port**: `3000`
   - **Site User**: e.g. `juanet`
3. After creation, go to **Sites → app.juanet.com → SSL/TLS → New Let's Encrypt Certificate**.

CloudPanel automatically creates the Nginx vhost that reverse-proxies `https://app.juanet.com`
to `http://127.0.0.1:3000`.

---

## 3. Deploy the code

SSH into the VPS **as the site user** (never root):

```bash
ssh juanet@YOUR_SERVER_IP
cd /home/juanet/htdocs/app.juanet.com

# clean the placeholder files CloudPanel created, then clone
rm -rf * .[!.]* 2>/dev/null
git clone https://github.com/YOUR_ORG/juanet.git .

npm ci        # or: npm install
```

---

## 4. Environment variables

Create `.env` in the project root (same folder as `package.json`):

```bash
cp .env.example .env
nano .env
```

```bash
# Browser-visible (inlined at BUILD time — you must rebuild after changing these)
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...

# Server-only (read at RUNTIME, never sent to the browser)
SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Optional: "mock" | "hybrid" | "full"
VITE_DATA_MODE=full
```

```bash
chmod 600 .env
```

> The `VITE_*` values are compiled into the client bundle at build time.
> Any change to them requires `npm run build` again.

---

## 5. Build for Node (not Cloudflare)

By default the project builds a Cloudflare Worker bundle. For self-hosting, set
`NITRO_PRESET=node-server` — `vite.config.ts` picks this up and emits a plain Node server:

```bash
NITRO_PRESET=node-server npm run build
```

The server entry point is:

```
.output/server/index.mjs      # most builds
dist/server/index.mjs         # fallback location — check which one exists
```

Verify locally on the box:

```bash
PORT=3000 node .output/server/index.mjs
curl -I http://127.0.0.1:3000
```

---

## 6. Run it as a managed service

### Option A — PM2 (simplest with CloudPanel)

```bash
npm install -g pm2      # or: npx pm2

pm2 start .output/server/index.mjs \
  --name juanet \
  --env production \
  --update-env

pm2 env 0                       # sanity-check env
pm2 save
pm2 startup systemd -u juanet --hp /home/juanet   # run the printed command as root
```

PM2 does **not** read `.env` automatically. Either export the vars first
(`set -a; source .env; set +a; pm2 start ...`) or use an ecosystem file:

```js
// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "juanet",
      script: ".output/server/index.mjs",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        SUPABASE_URL: "https://YOUR-PROJECT-REF.supabase.co",
        SUPABASE_ANON_KEY: "…",
        SUPABASE_SERVICE_ROLE_KEY: "…",
      },
    },
  ],
};
```

```bash
pm2 start ecosystem.config.cjs && pm2 save
```

### Option B — systemd

```ini
# /etc/systemd/system/juanet.service
[Unit]
Description=Juanet Command Center
After=network.target

[Service]
Type=simple
User=juanet
WorkingDirectory=/home/juanet/htdocs/app.juanet.com
EnvironmentFile=/home/juanet/htdocs/app.juanet.com/.env
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now juanet
sudo systemctl status juanet
```

---

## 7. Supabase configuration

1. **Apply the migrations** (Supabase Dashboard → SQL Editor), in order:
   `supabase/migrations/001_initial_schema.sql`, then everything in
   `supabase/migrations-pending/` from `002` through `009`.
2. **Authentication → URL Configuration**
   - Site URL: `https://app.juanet.com`
   - Redirect URLs: `https://app.juanet.com/**`
3. **Authentication → Providers**: enable Email (and any OAuth provider you use).
4. If you use OAuth, add `https://app.juanet.com/auth/login` to the allowed callbacks.

No network allow-listing is needed — Supabase is reached over HTTPS from the VPS.

---

## 8. Updating the app

```bash
cd /home/juanet/htdocs/app.juanet.com
git pull
npm ci
NITRO_PRESET=node-server npm run build
pm2 restart juanet          # or: sudo systemctl restart juanet
```

A tiny helper script:

```bash
# deploy.sh
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
git pull
npm ci
NITRO_PRESET=node-server npm run build
pm2 restart juanet
```

```bash
chmod +x deploy.sh
```

---

## 9. Nginx notes (CloudPanel → Vhost editor)

CloudPanel's default Node vhost is sufficient. Two optional tweaks:

```nginx
# larger uploads
client_max_body_size 25m;

# long-lived cache for hashed assets
location /_build/ {
    proxy_pass http://127.0.0.1:3000;
    add_header Cache-Control "public, max-age=31536000, immutable";
}
```

Keep the existing `proxy_set_header Upgrade / Connection` lines — they are required
for Supabase realtime channels proxied through the app.

---

## 10. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| 502 Bad Gateway | Node process not running or wrong port. `pm2 logs juanet`, confirm `PORT=3000` matches the CloudPanel App Port. |
| App loads but shows no data | `VITE_SUPABASE_*` missing at build time. Set them in `.env` and **rebuild**. |
| "relation does not exist" | A migration was not applied. Run `002`–`009` in order. |
| Login works but dashboard is empty | RLS policies — confirm the signed-in user has a `profiles` row and org membership. |
| `[unenv] … not implemented` | You built with the Cloudflare preset. Rebuild with `NITRO_PRESET=node-server`. |
| Changes not visible after deploy | Build output cached — `rm -rf .output dist node_modules/.vite` and rebuild. |

---

## 11. Security checklist

- [ ] `.env` is `chmod 600` and owned by the site user
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is **never** prefixed with `VITE_`
- [ ] HTTPS enforced (CloudPanel → SSL/TLS → Force HTTPS)
- [ ] Node process runs as the site user, not root
- [ ] RLS enabled on every public table (migrations do this)
- [ ] Supabase Site URL / Redirect URLs restricted to your domain
