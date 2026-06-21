# Lokaal Front-End Development Plan (RebuildYourLife.eu)

Ik heb de cloud-koppelingen (Vercel/GitHub) losgelaten. We raken je live Vercel-projecten en Supabase-productieomgeving nog **niet** aan. We isoleren de bouw.

We gaan in een afgeschermde, lokale omgeving een gloednieuw ultra-premium front-end bouwen voor `www.rebuildyourlife.eu`. Pas als jij 100% tevreden bent over het design en de functies, praten we pas weer over Vercel.

## User Review Required
> [!IMPORTANT]
> Lees de focuspunten voor de nieuwe lokale website door. Klik op **Proceed** om mij de opdracht te geven de pagina's en de AI Coach lokaal uit te bouwen.

## Proposed Changes / Bouwplan

### 1. Front-End Architectuur (Lokaal Geïsoleerd)
- Ik gebruik de al gestarte `rebuild-portal` map op jouw computer (`localhost:5173`).
- Alle koppelingen naar Supabase worden **losgekoppeld of op 'mock' (test-data) gezet**.
- Jouw live databases blijven volledig veilig en onaangeraakt.

### 2. Het Design (www.rebuildyourlife.eu)
- We bouwen het 'God-Tier' design uit in Next.js/React.
- **Hero Sectie:** Dominante, overtuigende copy gericht op het transformeren van levens en bedrijven.
- **Glassmorphism:** Het high-end, transparante design blijft de standaard.

### 3. De AI Coach Integratie
- Ik bereid de frontend voor op de inbedding van de AnythingLLM chat-widget.
- We testen de chat widget puur lokaal op jouw computer.

## Verification Plan

### Manual Verification
1. Ik bouw de code en de pagina's.
2. Ik houd de live webserver (`npm run dev`) draaiend op de achtergrond.
3. Jij bekijkt het design in je browser op `localhost`.
4. We sleutelen eraan tot het perfect is.

---
**Actie:** Klik op **Proceed** (of geef akkoord). Zodra je dat doet, trek ik me terug in de code en begin ik met het uitschrijven van de daadwerkelijke visuele pagina's voor de website.
