# League Championship ⚽

Premium football league management system with a cinematic UI, real-time standings, round management, and PWA support.

---

## Features

- Live league standings with gold/silver/bronze rankings
- Admin round management (Save Round / End Round)
- Player statistics, MVP card, profile cards
- Cinematic splash screen with stadium atmosphere
- Progressive Web App — installable on iOS and Android
- RTL Arabic + English language support
- Dark/light theme
- Fully responsive — mobile, tablet, laptop, desktop

---

## Install

```bash
cd frontend
npm install
```

---

## Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Build for Production

```bash
npm run build
npm run start
```

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel auto-detects Next.js.

### Option B — GitHub Integration

1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **Add New Project**.
3. Import the repository.
4. Set **Root Directory** to `frontend` (if the repo contains both `frontend/` and other folders).
5. Click **Deploy**.

No environment variables are required.

---

## Environment Variables

No env vars are required for basic operation. Data is persisted in the browser's `localStorage`.

See [`.env.example`](.env.example) for optional Supabase sync configuration.

---

## Build Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Start production server locally |
| `npm run lint` | Run ESLint |

---

## Data Persistence

All league data (players, rounds, standings, photos) is stored in `localStorage`.

- Data survives page refreshes on the same device/browser.
- To share data across devices, export a backup (Admin → Export/Backup) and import it on the other device.

---

## Admin Access

Click **Admin Login** in the navigation bar and enter the password to unlock round management.

Admin features:
- Create and save rounds
- End rounds (locks round, updates standings, opens next round)
- Edit any previous round
- Add/rename players
- Upload player photos
- Export/import league backup
- Reset league

---

## PWA Installation

On mobile, tap the browser menu and select **Add to Home Screen**. The app installs with a custom icon and runs fullscreen.

---

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4**
- **Framer Motion 12**
- **Radix UI**
- **TypeScript**
