# ⚡ MFE Store — Micro Frontend E-Commerce

A proof-of-concept **Micro Frontend** architecture built with **Webpack Module Federation**, demonstrating how independently deployed React apps can compose into a seamless e-commerce experience.

## 🚀 Live Demo

| App | URL | Role |
|-----|-----|------|
| **Shell App** | [mfe-store-silk.vercel.app](https://mfe-store-silk.vercel.app) | The main storefront — hosts the header, routing, and composes the remotes |
| **Product App** | [mfe-product-app.vercel.app](https://mfe-product-app.vercel.app) | Independently deployed remote serving the product grid |
| **Cart App** | [mfe-cart-app.vercel.app](https://mfe-cart-app.vercel.app) | Independently deployed remote serving the shopping cart |

### How It Works in Production

```
User visits mfe-store-silk.vercel.app
       │
       ▼
   App Shell loads (index.html + main.js)
       │
       ├── Fetches mfe-product-app.vercel.app/remoteEntry.js
       │   └── Product grid renders inside the shell
       │
       └── Fetches mfe-cart-app.vercel.app/remoteEntry.js
           └── Cart widget renders inside the shell
```

Each remote is a **standalone Vercel deployment**. The Shell fetches their `remoteEntry.js` at runtime via Webpack Module Federation — no build-time coupling. This means the Cart Team or Product Team can push updates to their app independently, and the Shell picks up the changes **without redeploying**.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  App Shell (:3000)               │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  Header   │  │   Router     │  │ Event Bus │  │
│  └──────────┘  └──────────────┘  └───────────┘  │
│        ▲              │                ▲         │
│        │         ┌────┴────┐           │         │
│        │         ▼         ▼           │         │
│  ┌───────────────┐  ┌──────────────┐   │         │
│  │  Product App  │  │   Cart App   │───┘         │
│  │  (Remote)     │  │   (Remote)   │             │
│  │  :3001        │  │   :3002      │             │
│  └───────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────┘
```

| App | Port | Role |
|-----|------|------|
| `app-shell` | 3000 | Host — routing, header, shell layout |
| `product-app` | 3001 | Remote — product grid & cards |
| `cart-app` | 3002 | Remote — shopping cart widget |
| `event-bus` | — | Shared package — cross-MFE communication via Custom Events |

## Quick Start

```bash
# Install dependencies (npm workspaces)
npm install

# Start all 3 dev servers concurrently
npm run dev

# Open http://localhost:3000
```

## Production Build

```bash
npm run build    # Builds all apps via Turborepo
```

Each app outputs to its own `dist/` directory.

## Deploying to Vercel

This monorepo deploys as **3 separate Vercel projects** from the same GitHub repo. Each project uses the **monorepo root** as its Root Directory and a Turbo `--filter` to build only the relevant app.

### 1. Deploy Remotes First

| Vercel Project | Root Directory | Build Command | Output Directory |
|---------------|----------------|---------------|-----------------|
| `mfe-product-app` | `.` (root) | `npx turbo run build --filter=@mfe/product-app` | `apps/product-app/dist` |
| `mfe-cart-app` | `.` (root) | `npx turbo run build --filter=@mfe/cart-app` | `apps/cart-app/dist` |

### 2. Deploy the App Shell

| Vercel Project | Root Directory | Build Command | Output Directory |
|---------------|----------------|---------------|-----------------|
| `mfe-store` | `.` (root) | `npx turbo run build --filter=@mfe/app-shell` | `apps/app-shell/dist` |

Set these **Environment Variables** on `mfe-store`:

| Variable | Value |
|----------|-------|
| `PRODUCT_APP_URL` | Your deployed Product App URL (e.g. `https://your-product-app.vercel.app`) |
| `CART_APP_URL` | Your deployed Cart App URL (e.g. `https://your-cart-app.vercel.app`) |

### Key Points
- Root Directory is the monorepo root so `npm install` resolves workspace packages (like `@mfe/event-bus`)
- Vercel auto-detects Turborepo and enables Remote Caching
- Remote apps serve `remoteEntry.js` with CORS headers (`vercel.json`)
- App Shell uses SPA rewrites for client-side routing

## Architectural Decisions & Trade-offs

This Proof of Concept was designed to evaluate enterprise-scale frontend architecture, specifically solving the problem of monolithic release bottlenecks. Several key decisions were made to prioritize team autonomy and system resilience:

* **Runtime Integration (Module Federation):** Chose Webpack Module Federation over build-time composition (like NPM packages). This allows independent deployment cycles. A dedicated "Cart Team" can deploy updates instantly without requiring the "Host Team" to trigger a full site rebuild.
* **Decoupled State via Custom Events:** Deliberately avoided a shared global state manager (like Redux) across the federation boundary. Relying on a lightweight Event Bus using native Browser Custom Events ensures the micro frontends remain strictly decoupled.
* **Styling Isolation:** Implemented CSS Modules to guarantee zero CSS leakage between applications, an absolute necessity when autonomous teams are injecting code into the same viewport.
* **Resilience:** The App Shell wraps remote imports in React Error Boundaries. If the Cart network request fails or the application crashes, the Host gracefully catches the error without taking down the Product Discovery experience.

## Tech Stack

- **React 18** — UI framework
- **Webpack 5 Module Federation** — runtime remote loading
- **Turborepo** — monorepo build orchestration
- **CSS Modules** — scoped styling (zero leakage between MFEs)
- **Custom Events** — decoupled cross-MFE state bus
