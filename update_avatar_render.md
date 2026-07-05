# Update: AI Avatar Render (Optie C — Replicate, geen abonnement)

De oude Python-code plakte alleen tekst op een zwarte dia — geen echte video-transformatie. Dit los ik hierbij op met een werkende avatar-render pipeline: een foto + audio worden omgezet in een pratende, lip-synced avatar-video. Gebouwd via **Optie C**: een open source model (SadTalker) gehost op Replicate — geen maandelijks abonnement (zoals HeyGen), geen eigen GPU-server om te beheren (zoals Optie B), je betaalt alleen per daadwerkelijke render (~$0,02–0,05 per video, check je Replicate dashboard voor actuele prijzen).

Dit volgt exact hetzelfde patroon als de Central AI Router-update: server action start een job → Inngest voert 'm uit op de achtergrond → Prisma houdt status bij → UI pollt tot 'ie klaar is.

## Wat is er gebouwd?

### 1. Server action
- **[NEW]** `apps/web/src/app/actions/avatar-render.ts`
  - `startAvatarRenderJob(imageUrl, audioUrl, userId)` — maakt een job aan in Prisma, stuurt een event naar Inngest, geeft direct `{ jobId }` terug. Geen wachten, geen Vercel-timeout risico.

### 2. Achtergrond-render via Inngest
- **[MODIFY]** `apps/web/src/inngest/functions.ts` — nieuwe functie `avatarRenderJob` toegevoegd naast de bestaande `productHunterJob` en `seoAuditJob`.
  - Start een prediction bij Replicate (SadTalker-model).
  - **Polling met circuit breaker:** maximaal 40 pogingen × 15 seconden (10 minuten) via `step.sleep`. Geen eeuwige wachtlus als Replicate vastloopt — zelfde principe als `MAX_TOOL_CALLS` in de AI-router, nu toegepast op wachttijd i.p.v. AI-aanroepen.
  - Slaat bij succes de `videoUrl` op, bij falen of timeout een duidelijke foutmelding.
- **[MODIFY]** `apps/web/src/app/api/inngest/route.ts` — `avatarRenderJob` moet nog toegevoegd worden aan de `functions: [...]`-array.

### 3. Database
- **[NEW]** Prisma-model `AvatarRenderJob` (`imageUrl`, `audioUrl`, `status`, `videoUrl`, `error`) — zelfde structuur als `ProductHunterJob`/`SeoAuditJob`, zodat het overzichtelijk blijft binnen één patroon.

### 4. UI-koppeling
- **[NEW]** `apps/web/src/app/api/jobs/avatar-render/[jobId]/route.ts` — status-endpoint, met check dat een gebruiker alleen zijn eigen jobs kan opvragen.
- Hergebruikt de bestaande `useJobPolling.ts` hook — geen nieuwe hook nodig, alleen endpoint `/api/jobs/avatar-render` meegeven.

## Wat je zelf nog moet doen om dit te activeren

1. **Replicate-account** aanmaken, `REPLICATE_API_TOKEN` in `.env` zetten.
2. Op `replicate.com/cjwbw/sadtalker` → tab "API" → version-hash kopiëren → als `SADTALKER_MODEL_VERSION` in `.env` zetten (deze hash verandert af en toe bij model-updates, dus check 'm opnieuw als renders plots beginnen te falen).
3. Prisma-migratie draaien: `npx prisma migrate dev --name add_avatar_render_job`.
4. `avatarRenderJob` toevoegen aan de `functions`-array in `api/inngest/route.ts`.
5. UI-scherm bouwen (upload foto + audio, of koppelen aan een bestaande module) dat `startAvatarRenderJob` aanroept en `useJobPolling` gebruikt voor de statusweergave.

## Bewust nog niet meegenomen
- **Text-to-speech-stap:** als een gebruiker straks alleen tekst intypt ("laat de avatar dit zeggen") in plaats van al een audiobestand aan te leveren, is er eerst een TTS-stap nodig (bv. Kokoro-TTS open source via Replicate, of ElevenLabs gratis tier). Dit bouw ik erbij zodra je aangeeft dat je die flow wil — dan wordt het pad "tekst → stem → avatar-video" in één keer werkend.
- Geen fallback naar een tweede avatar-model (bv. Hallo als SadTalker faalt) — kan later analoog aan de provider-cascade in `ai-router.ts` als de kwaliteit/betrouwbaarheid daar aanleiding toe geeft.

## Verificatie
- Test lokaal met `npx inngest-cli@latest dev` — dashboard op `localhost:8288` toont de render-job live, inclusief elke poll-poging.
- Start een render met een korte audio (~5 sec) eerst, om te bevestigen dat de hele keten (job → Replicate → polling → Prisma → UI) werkt vóór je een lange video test.
- Zet je `REPLICATE_API_TOKEN` tijdelijk fout om te bevestigen dat de job netjes op "failed" met een duidelijke foutmelding eindigt, in plaats van vast te lopen.
