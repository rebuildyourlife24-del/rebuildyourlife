# DEPLOYMENT CONSTITUTION

## Vercel Infrastructure
The Syndicate (Rebuild Your Life) wordt in productie gehost op Vercel. Elke push naar GitHub activeert een deployment. 

## 1. De "No Breaking Builds" Rule
Voordat code naar de `main` branch gaat, moet het lokaal foutloos compileren:
* `npm run build` moet passeren zonder Turbopack/Next.js "Server Components render error" of ontbrekende exports (zoals verouderde Lucide-react iconen).
* `tsc --noEmit` moet passeren. Type errors zijn build-blokkades op Vercel tenzij `ignoreBuildErrors` op true staat (wat we vermijden als het kan).

## 2. Environment Variabelen
* Bij het toevoegen van nieuwe providers (bijv. Cerebras, Groq) moeten de bijbehorende API-keys eerst in de Vercel Environment Variables worden gezet, voordat de build wordt getriggerd, anders crasht de applicatie.

## 3. Middleware & Edge Runtime
* Next.js Middleware draait op de Edge Runtime. Importeer **geen** Node.js-exclusieve libraries (zoals `fs`, `child_process`, `crypto`) binnen `middleware.ts` of bestanden die daarin geïmporteerd worden.
* Gebruik de specifieke `@supabase/ssr` of Edge-compatible auth-clients.

## 4. Downtime Preventie & Rollbacks
* In geval van een productiefout (FATAL SYSTEM CRASH), ga direct in de Vercel logs of browser-console kijken wat er mis is. 
* Herstel code via een hotfix in een nieuwe commit. 
* Gebruik de Vercel "Instant Rollback" functie in de Vercel UI als een kritiek probleem de omzet raakt, terwijl we lokaal de fix bouwen. Maak geen destructieve Git rollbacks (zoals `git reset --hard`) om git history corruptie te voorkomen.

## 5. Database Migraties (Prisma)
* Als je `schema.prisma` aanpast, voer `npx prisma db push` (voor dev) of `npx prisma migrate dev` uit.
* In productie (Vercel) zorgt het deployment-script ervoor dat migraties worden gedraaid of dit is via CI/CD geregeld. Zorg dat Prisma schema wijzigingen backwards-compatible zijn om downtime te voorkomen.
