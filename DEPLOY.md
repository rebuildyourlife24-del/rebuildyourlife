# 🚀 VERCEL DEPLOYMENT GIDS — RebuildYourLife Monorepo
# Eén database (Supabase eu-west-1), 3 Vercel projecten
# Login overal: hsemler50@gmail.com / Megan123!

---

## 📦 ARCHITECTUUR OVERZICHT

| App             | Vercel Project         | Gewenste URL                          | Root Directory           |
|-----------------|------------------------|---------------------------------------|--------------------------|
| web             | rebuildyourlife-web    | app.rebuildyourlife.eu                | apps/web                 |
| command-center  | rebuildyourlife-cc     | cc.ai-henksemler.nl                   | apps/command-center      |
| enterprise-os   | rebuildyourlife-ent    | enterprise.ai-henksemler.nl           | apps/enterprise-os       |

Alle 3 praten met DEZELFDE Supabase database:
  maruupmdslovtfcoxdlu (eu-west-1)
  DATABASE_URL = postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
  DIRECT_URL   = postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:5432/postgres

---

## STAP 1 — DATABASE MIGREREN (1x doen, nooit opnieuw)

Open PowerShell en voer uit:

cd C:\\Users\\hseml.gemini\\antigravity\\scratch\\rebuildyourlife npm install cd packages/database npx prisma migrate deploy npx tsx src/seed.ts

Dit maakt alle tabellen aan en zet jouw account klaar: Email: hsemler50@gmail.com Wachtwoord: Megan123

---

## STAP 2 — VERCEL PROJECT 1: WEB (app.rebuildyourlife.eu)

1. Ga naar https://vercel.com/new
2. Klik "Import Git Repository" → kies je GitHub repo
3. Stel in:
   - Framework Preset: Next.js
   - Root Directory: apps/web     ← DIT IS CRUCIAAL
   - Build Command: (laat leeg, vercel.json regelt dit)
   - Output Dir: .next
4. Klik "Environment Variables" en voeg toe:

   DATABASE_URL        = postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   DIRECT_URL          = postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
   JWT_SECRET          = RYL-JWT-2026-ChangeThisInVercel-64charMin-HenkSemlerSupremeOverseer
   NEXT_PUBLIC_API_URL = https://rebuildyourlife-api.onrender.com/api/v1
   NODE_ENV            = production

5. Klik "Deploy"
6. Na deploy → Settings → Domains → Voeg toe: app.rebuildyourlife.eu

---

## STAP 3 — VERCEL PROJECT 2: COMMAND CENTER (cc.ai-henksemler.nl)

1. Ga naar https://vercel.com/new
2. Importeer HETZELFDE repo (andere root directory)
3. Stel in:
   - Framework Preset: Next.js
   - Root Directory: apps/command-center    ← DIT IS CRUCIAAL
4. Environment Variables:

   DATABASE_URL                = postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   DIRECT_URL                  = postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
   JWT_SECRET                  = RYL-JWT-2026-ChangeThisInVercel-64charMin-HenkSemlerSupremeOverseer
   OPENAI_API_KEY              = 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
   GOOGLE_GENERATIVE_AI_API_KEY = (vul je Gemini key in van https://aistudio.google.com/app/apikey)
   NODE_ENV                    = production

5. Klik "Deploy"
6. Settings → Domains → cc.ai-henksemler.nl

---

## STAP 4 — VERCEL PROJECT 3: ENTERPRISE OS (enterprise.ai-henksemler.nl)

1. Ga naar https://vercel.com/new
2. Importeer HETZELFDE repo
3. Stel in:
   - Root Directory: apps/enterprise-os    ← DIT IS CRUCIAAL
4. Environment Variables:

   DATABASE_URL = postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   DIRECT_URL   = postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
   JWT_SECRET   = RYL-JWT-2026-ChangeThisInVercel-64charMin-HenkSemlerSupremeOverseer
   NODE_ENV     = production

5. Klik "Deploy"
6. Settings → Domains → enterprise.ai-henksemler.nl

---

## STAP 5 — API BACKEND (Render.com)

De Express API kan NIET op Vercel (stateful process).
Deploy op Render.com met render.yaml (al aanwezig in repo).

1. Ga naar https://render.com → New Web Service
2. Koppel GitHub repo
3. Stel in:
   - Build Command: npm install && npx turbo run build --filter=@rebuildyourlife/api
   - Start Command: cd apps/api && npm start
4. Environment Variables op Render:

   DATABASE_URL       = postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   DIRECT_URL         = postgresql://postgres.maruupmdslovtfcoxdlu:12Rebuild1234598@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
   JWT_SECRET         = RYL-JWT-2026-ChangeThisInVercel-64charMin-HenkSemlerSupremeOverseer
   JWT_REFRESH_SECRET = RYL-REFRESH-2026-ChangeThisInVercel-64charMin-HenkSemlerSupreme
   NODE_ENV           = production
   FRONTEND_URL       = https://app.rebuildyourlife.eu
   OPENAI_API_KEY     = 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

---

## STAP 6 — GITHUB PUSHEN (vereist voor Vercel)

Als je nog geen GitHub repo hebt:

  cd C:\Users\hseml\.gemini\antigravity\scratch\rebuildyourlife
  git init
  git add .
  git commit -m "feat: unified database + vercel deployment setup"
  
  # Maak repo aan op github.com (naam: rebuildyourlife)
  git remote add origin https://github.com/JOUW_USERNAME/rebuildyourlife.git
  git branch -M main
  git push -u origin main

Als je al een repo hebt:

  git add .
  git commit -m "fix: unify all apps to single Supabase database"
  git push

---

## ✅ VERIFICATIE NA DEPLOY

Test deze URLs na deploy:

  https://app.rebuildyourlife.eu/auth/login
    → Login: hsemler50@gmail.com / Megan123!
    → Moet doorsturen naar /dashboard

  https://cc.ai-henksemler.nl/login  
    → Login: hsemler50@gmail.com of shorthand "henk" / Megan123!
    → Moet doorsturen naar /hq (de War Room)

  https://rebuildyourlife-api.onrender.com/api/v1/health
    → Moet { "status": "ok" } teruggeven

---

## ❗ VEELGEMAAKTE FOUTEN

PROBLEEM: "Cannot find user" bij inloggen
OPLOSSING: Voer seed script uit: cd packages/database && npx tsx src/seed.ts

PROBLEEM: Build faalt op Vercel "Cannot find module @prisma/client"
OPLOSSING: Voeg toe in Vercel environment: PRISMA_GENERATE_DATAPROXY=false

PROBLEEM: "PrismaClientInitializationError" op Vercel
OPLOSSING: Controleer of DATABASE_URL exact klopt (inclusief ?pgbouncer=true)

PROBLEEM: JWT errors na inloggen
OPLOSSING: Zorg dat JWT_SECRET in ALLE Vercel projecten HETZELFDE is

---

## 🗄️ DATABASE INFO

Supabase Project: maruupmdslovtfcoxdlu
Regio: eu-west-1 (Frankfurt)
Wachtwoord: 12Rebuild1234598
Studio URL: https://supabase.com/dashboard/project/maruupmdslovtfcoxdlu

Jouw account in de database:
  Email:      hsemler50@gmail.com
  Wachtwoord: Megan123!
  Rol:        SUPREME_OVERSEER / ADMIN

---

Gegenereerd: 13-6-2026
