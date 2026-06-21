# 🏛️ Implementatieplan: God Mode (CFO Vault UI)

We gaan de blinde muur rondom de financiële kluis weghalen. De backend draait al, nu maken we het visueel in de **Wealth Dashboard** (God Mode).

## 1. De J.A.R.V.I.S. Kluis-Sensoren
In plaats van "Fase 1 t/m 4" gaan we de echte live data uit de kluis ophalen:
- **Treasury Balance:** Live weergave van het *liquide* geld dat klaarligt om geherinvesteerd te worden of veilig is gesteld.
- **Risk Exposure:** De meter die aangeeft hoeveel van het kapitaal gereserveerd is voor AI-tests (de keiharde 2% max-rule).
- **Tax Shields:** De afgestorte bedragen voor de Belastingdienst (De "Pensioen FOR" en "Herinvesteringsreserve").

## 2. Visuele Upgrade
We gebruiken dezelfde "Glassmorphism" donkere bouwstenen als de rest van de War Room. Gouden en groene accenten (geld) gecombineerd met rood (risico). 

## 3. Tech Stack Wijzigingen
- Aanmaken van `apps/web/src/app/actions/cfo.ts` om de kluisdata veilig op te halen voor de frontend.
- Wijzigen van `apps/web/src/app/dashboard/wealth/page.tsx` om de nieuwe data te renderen in *High-Net-Worth* gestileerde kaarten.

---

## User Review Required

> [!IMPORTANT]
> **Vercel Domein Blokkade (`rebuildyourlife.eu`)**
> Ik heb geprobeerd het EU-domein te forceren met de overrule-commando's, maar Vercel blokkeert dit op het hoogste beveiligingsniveau. Vercel zegt: *"Verwijder het domein eerst handmatig uit het oude test-project in het Vercel Dashboard"*. Je moet dus heel even inloggen op Vercel.com en daar `rebuildyourlife.eu` weggooien bij je oude project. Zodra je dat doet, trekt mijn systeem hem automatisch binnen.
>
> *(Je `ai.ai-henksemler.nl` domein is overigens wel 100% succesvol doorgeschakeld!)*

*Ga je akkoord met de uitrol van dit God Mode dashboard? Klik op goedkeuren.*
