# Doel

De gebruiker ervaart blokkades met de Render configuratie en heeft expliciet verzocht om het probleem vannacht volledig autonoom op te lossen zonder verdere handmatige acties ("zonder mijn tussen komen").
Om Vercel 100% autonoom en feilloos te laten functioneren, migreren we de Node.js (Express) backend naar Vercel Serverless Functions via Next.js. Hierdoor vervalt de afhankelijkheid van Render volledig en wordt de architectuur versimpeld naar een monolithische Vercel deployment die direct werkt na een GitHub push.

## Voorgestelde Wijzigingen

### 1. Backend Ombouwen voor Serverless
- Installeer `serverless-http` in `apps/api`.
- Exporteer de Express `app` vanuit `apps/api/src/server.ts` (en voorkom `app.listen` als het in een serverless omgeving draait).
- Zorg dat `apps/api` als NPM package geëxporteerd kan worden.

### 2. Next.js API Routes (Vercel)
- Maak een "catch-all" route aan in `apps/web/src/app/api/[...slug]/route.ts`.
- Importeer de Express app uit `@rebuildyourlife/api` en wikkel deze in `serverless-http`.
- Hierdoor handelt Vercel (Next.js) automatisch alle `/api/v1/*` verzoeken af zonder externe server!

### 3. Frontend & Vercel Configuratie Update
- Pas `apps/web/src/lib/api.ts` aan zodat `API_URL` altijd verwijst naar `/api/v1` (relatief), in plaats van Render.
- Pas `apps/command-center/src/app/hq/page.tsx` aan zodat de fetch wijst naar de eigen Vercel URL (of de Web URL).

## Verificatie Plan
Ik zal lokaal de Vercel build uitvoeren (`npx turbo run build`) en de database seeden. Vervolgens push ik alles naar GitHub. Omdat de API nu in Next.js verankerd is, zal Vercel de API automatisch online gooien en werkt inloggen morgenochtend direct.
