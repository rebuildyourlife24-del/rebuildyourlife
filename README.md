# 🌌 RebuildYourLife — Orion's Eye Platform

**Production-ready AI-powered SaaS — The most ambitious personal finance + life OS ever built.**

> *"Van schulden naar miljonair — met Orion als je Supreme AI Partner."*

---

## 🏗️ Architectuur

```
rebuildyourlife/
├── apps/
│   ├── web/              # Next.js 16 — gebruikers SaaS platform (app.rebuildyourlife.eu)
│   ├── command-center/   # Next.js 16 — Orion AI War Room (privé CEO dashboard)
│   ├── api/              # Express 4 — REST API backend (Render.com)
│   ├── enterprise-os/    # Next.js 16 — Enterprise dashboard (ai-henksemler.nl)
│   └── orion-mobile/     # Expo/React Native — Mobiele Orion app
├── packages/
│   ├── database/         # Prisma + Supabase (PostgreSQL)
│   └── shared/           # TypeScript types en enums
├── .github/workflows/    # CI/CD pipeline
├── turbo.json            # Turborepo configuratie
└── docker-compose.yml    # Lokale dev (optioneel)
```

---

## 🚀 Quick Start (Lokale ontwikkeling)

### 1. Prerequisites

- **Node.js ≥ 20** + **npm ≥ 10**
- **Git**

### 2. Clone & Install

```bash
git clone https://github.com/jouw-org/rebuildyourlife.git
cd rebuildyourlife
npm install
```

### 3. Environment instellen

```bash
cp .env.example .env
# Vul echte waarden in (zie sectie Environment Variables)
```

### 4. Prisma Client genereren

```bash
npm run db:generate
```

### 5. Development servers starten

```bash
npm run dev
# Start: web op :3000, command-center op :3001, api op :5000
```

---

## 🌍 Apps & URLs

| App | Local | Production |
|-----|-------|------------|
| **web** (klanten SaaS) | `http://localhost:3000` | `https://app.rebuildyourlife.eu` |
| **command-center** (CEO) | `http://localhost:3001` | `https://cc.ai-henksemler.nl` |
| **api** (backend) | `http://localhost:5000` | `https://rebuildyourlife123.onrender.com` |
| **enterprise-os** | `http://localhost:3002` | `https://enterprise.ai-henksemler.nl` |

---

## 🔐 Environment Variables (Vereist)

Zie `.env.example` voor alle variabelen. Kritieke variabelen:

| Variabele | Beschrijving | Vereist |
|-----------|--------------|---------|
| `DATABASE_URL` | Supabase pooled connection (port 6543) | ✅ |
| `DIRECT_URL` | Supabase direct connection (port 5432, voor migrations) | ✅ |
| `JWT_SECRET` | 64-char random hex string | ✅ |
| `JWT_REFRESH_SECRET` | 64-char random hex string (anders dan JWT_SECRET) | ✅ |
| `OPENAI_API_KEY` | OpenAI API sleutel | ✅ |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API sleutel (voor Orion) | ✅ |
| `MOLLIE_API_KEY` | Mollie betalingen API sleutel | ⚠️ Payments |
| `REDIS_URL` | Redis connection string | ⚠️ Rate limiting |

**JWT_SECRET genereren:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🗄️ Database (Supabase)

**Project**: `maruupmdslovtfcoxdlu` (eu-west-1)

### Schema migreren

```bash
# Development
cd packages/database
npm run db:migrate

# Productie (automatisch via CI)
npx prisma migrate deploy
```

### Seeding

```bash
cd packages/database
npm run db:seed
```

### Prisma Studio (GUI)

```bash
cd packages/database
npm run db:studio
```

---

## 🤖 API Endpoints

Basis URL: `https://rebuildyourlife123.onrender.com/api/v1`

| Methode | Route | Auth | Beschrijving |
|---------|-------|------|--------------|
| GET | `/health` | — | API status check |
| POST | `/auth/register` | — | Registreren |
| POST | `/auth/login` | — | Inloggen (JWT) |
| POST | `/auth/refresh` | — | Token vernieuwen |
| POST | `/auth/logout` | Bearer | Uitloggen |
| GET | `/user/profile` | Bearer | Profiel ophalen |
| GET | `/goal` | Bearer | Doelen ophalen |
| POST | `/goal` | Bearer | Doel aanmaken |
| GET | `/budget` | Bearer | Budgetten ophalen |
| POST | `/budget` | Bearer | Budget aanmaken |
| GET | `/debt` | Bearer | Schulden ophalen |
| POST | `/debt` | Bearer | Schuld toevoegen |
| POST | `/ai/chat` | Bearer | AI chat (20 agents) |
| GET | `/ai/agents` | Bearer | Agents overzicht |
| GET | `/payments` | Bearer | Betalingsoverzicht |
| POST | `/payments/create` | Bearer | Betaling aanmaken (Mollie) |

---

## 🧠 Orion AI — 20 Agents

| Agent | Domein |
|-------|--------|
| ORION_CORE | Supreme AI Partner (alles) |
| LIFE_STRATEGIST | Persoonlijke ontwikkeling |
| HEALTH_COACH | Gezondheid & energie |
| MINDSET_AGENT | Mentale veerkracht |
| DAILY_PLANNER | Dag planning |
| FINANCE_MGR | Financieel beheer |
| DEBT_CRUSHER | Schulden vernietiging |
| INVESTMENT_AGENT | Investering advies |
| TAX_OPTIMIZER | Belasting optimalisatie |
| WEALTH_ENGINE | €100 → €1M strategie |
| COMMISSION_AGENT | Affiliate marketing |
| ECOMMERCE_AGENT | E-commerce |
| CONTENT_AGENT | Content & social media |
| LEAD_AGENT | Lead generatie |
| SEO_MARKETING | SEO & marketing |
| LEGAL_SHIELD | Juridische bescherming |
| CISO_AGENT | Cybersecurity |
| AUTOMATION_AGENT | Automatisering |
| WEARABLE_AGENT | Smartwatch data |
| KNOWLEDGE_AGENT | Kennis & leren |

---

## 🚀 Deploy

### Vercel (web + command-center)

```bash
# Via Vercel dashboard of CLI:
npx vercel --prod

# Environment variables instellen in Vercel dashboard:
# DATABASE_URL, JWT_SECRET, OPENAI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY
```

Vercel Project ID: `prj_3YPmTiJMyA5ce6TFaXj9cHEWFaeC`

### Render.com (API)

```yaml
# render.yaml is aanwezig — push naar GitHub triggert auto-deploy
# Secrets instellen in Render dashboard:
# DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, OPENAI_API_KEY
```

### GitHub Actions (CI)

Secrets in te stellen op GitHub:
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `OPENAI_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`

---

## 📱 Orion Mobile (Expo)

```bash
cd apps/orion-mobile
npx expo start --lan

# Of gebruik het bat-script op de Desktop:
# Start_Orion_App.bat
```

Scan de QR-code met Expo Go op je telefoon.

---

## 🔒 Security

- JWT tokens (15min access / 7d refresh)
- HTTP-only cookies voor web sessies
- Helmet.js security headers op API
- Rate limiting (express-rate-limit)
- Wachtwoorden bcrypt (12 rounds)
- Prisma named placeholders (SQL injection proof)
- **NOOIT credentials commiten** — controleer `.gitignore`

---

## ⚠️ Bekende Technische Schuld

| Item | Prioriteit | Status |
|------|-----------|--------|
| Email verificatie flow in API | Hoog | Stub — implementeer met Resend/SMTP |
| Wachtwoord reset in API | Hoog | Stub — implementeer |
| `command-center` heeft eigen Prisma schema | Medium | Samenvouwen met `packages/database` |
| React versie conflict (18 root vs 19 apps) | Medium | Override toegevoegd |
| `database/.env` wijst naar ander Supabase project | Medium | Unificeren naar eu-west-1 |
| Orion Mobile is minimale stub | Laag | Groeit mee |

---

## 📈 Roadmap

- **Fase 1** ✅ Auth, Goals, Budget, Debt, AI Chat
- **Fase 2** 🔄 Mollie betalingen, subscriptions
- **Fase 3** 🔄 Shopify integratie, Social media engine
- **Fase 4** 📅 Wearable/smartwatch integratie
- **Fase 5** 📅 Volledig autonome agent swarm
- **Fase 6** 📅 €100 → €1M automatisering live
