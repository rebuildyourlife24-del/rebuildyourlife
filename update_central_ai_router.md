# Update: Central AI Router & Async Queue Fundering

De motor onder de 15+ modules is nu gebouwd. Dit lost het probleem op waar het task.md-item "1. Central AI Router Ontwikkelen" om vroeg: elke module riep tot nu toe zijn eigen AI-provider rechtstreeks aan (vandaar de losse 403-fout), zonder fallback, zonder limiet op retries, en zonder gestandaardiseerde output. Dat is nu opgelost met één centrale laag waar alle modules doorheen gaan.

## Wat is er gebouwd?

### 1. De Central AI Router (`ai-router.ts`)
- **[NEW]** `apps/web/src/app/actions/ai-router.ts`
  - Fallback-cascade: Cerebras → Groq → Groq-Mixtral → Gemini → OpenRouter. Faalt de eerste provider, dan schakelt de router automatisch door — de gebruiker merkt er niets van.
  - **Circuit breaker:** hard maximum van 3 pogingen per taak (`MAX_TOOL_CALLS_DEFAULT`). Voorkomt de "Infinite Loop"-dreiging uit het governance-onderzoek — geen oneindige retries meer die stilletjes API-credits opeten.
  - **Model forcing:** elke module kan nu een `preferred`-provider meegeven, exact zoals voorgesteld in `ai_model_research.md` (Hermes → Gemini, CMO/CFO → Groq, Swarm/workers → Groq-Mixtral).
  - **Gestandaardiseerde JSON-parsing:** markdown-fences worden gestript, output wordt gevalideerd tegen een zod-schema. Elke module krijgt nu identiek betrouwbare, voorspelbare output terug in plaats van zelf edge-cases op te vangen.

### 2. Twee modules omgebouwd als blauwdruk
- **[MODIFY]** `seo-audit.ts` — draait nu via de router (`preferred: "gemini"`), scraping (Firecrawl) blijft ongewijzigd.
- **[MODIFY]** `product-hunter.ts` — draait nu via de router (`preferred: "groq-mixtral"`), en is meteen gekoppeld aan de nieuwe job-queue omdat scrape + AI + Shopify-push te zwaar is voor een synchrone Vercel-call.

### 3. Het "Fabrieks-systeem" (async queue via Inngest)
- **[NEW]** `apps/web/src/inngest/client.ts` — basissetup.
- **[NEW]** `apps/web/src/app/api/inngest/route.ts` — het serve-endpoint waar Vercel jobs daadwerkelijk laat draaien.
- **[NEW]** `apps/web/src/inngest/functions.ts` — de twee achtergrondtaken (`productHunterJob`, `seoAuditJob`), elk met automatische retries en stap-voor-stap logging.
- **Resultaat:** een gebruiker klikt "Start", ziet meteen "Taak gestart", en kan wegklikken. Geen 15-seconden Vercel-timeout meer bij zware taken.

### 4. Database & UI-koppeling
- **[NEW]** Prisma-modellen `ProductHunterJob` en `SeoAuditJob` — status (`pending` → `running` → `done`/`failed`), resultaat en eventuele fout worden hierin bijgehouden.
- **[NEW]** `apps/web/src/app/api/jobs/seo-audit/[jobId]/route.ts` — endpoint waarmee de UI de status van een taak kan opvragen, met een check dat een gebruiker alleen zijn eigen jobs kan inzien.
- **[NEW]** `apps/web/src/hooks/useJobPolling.ts` — React hook die elke 3 seconden pollt totdat een taak klaar is, met een kant-en-klaar gebruiksvoorbeeld voor de SEO Audit-pagina.

## Wat dit oplost, per scenario

| Situatie | Vóór | Ná |
|---|---|---|
| Eén provider geeft een 403 | Hele module faalt | Router schakelt automatisch door naar de volgende provider |
| Alle providers zijn down | Oneindig blijven proberen / crash | Circuit breaker stopt na 3 pogingen met duidelijke foutmelding |
| Zware taak (scrape + AI + push) | Vercel timeout na ~15s | Job draait op de achtergrond, gebruiker krijgt melding zodra klaar |
| JSON-output van AI | Elke module parseert zelf, inconsistent | Eén standaard parser + schema-validatie voor alle modules |

## Nog open (bewust niet meegenomen in deze stap)
- De overige 13 modules moeten nog hetzelfde patroon krijgen (router + eventueel job) — gebruik `seo-audit.ts` en `product-hunter.ts` als blauwdruk, niet als uitzondering.
- Rate limiting / budget-tracking per agent (Upstash Redis) uit het governance-onderzoek is nog niet gebouwd — de circuit breaker voorkomt oneindige loops per taak, maar niet globale kosten over meerdere gebruikers heen.
- RBAC (Read-Only vs. Read-Write agents) is nog niet toegevoegd aan de router.

## Verificatie
- Draai lokaal `npx inngest-cli@latest dev` naast je dev-server — dashboard op `localhost:8288` toont live elke job-run, inclusief timing per stap.
- Test de SEO Audit met een domein terwijl je een van de API-keys tijdelijk fout zet — bevestig dat de audit alsnog slaagt via de volgende provider in de cascade.
- Test Product Hunter en klik direct weg na "Start" — bevestig dat het resultaat er later gewoon is zodra je terugkomt.
