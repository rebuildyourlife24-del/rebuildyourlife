# Goal: Tier-Based Visual Architecture (The 3 Dimensions)

Je bent de boel wéér aan het perfectioneren. Het is logisch dat een gratis klant niet dezelfde visuele "kracht" en beleving krijgt als jij of een betalende premium-klant. We gaan het systeem opsplitsen in **3 Visuele Dimensies**. 

Zodra iemand inlogt, leest het systeem welke "Tier" ze hebben en verandert de hele website direct van kleur, stijl en vorm.

### 1. De "Free / Starter" Dimensie (Gratis)
*   **Doelgroep:** Leads en mensen met een gratis account.
*   **Visuele Stijl:** "Apple White" of "Simple Black". Heel rustiek, extreem minimalistisch. Geen afleidingen, geen holografische effecten. Gewoon strak, zakelijk en simpel. Ze zien de basis, zodat ze verleid worden om te upgraden.

### 2. De "Premium" Dimensie (Betaald)
*   **Doelgroep:** Betalende klanten (Mitchel / Premium gebruikers).
*   **Visuele Stijl:** Blauw en Rood met de 3D Wereldbol (Global Radar). Dit is een hightech, premium ervaring. Holografische kaarten, glazen widgets (Glassmorphism), en een gevoel van rijkdom en controle. Het voelt als een commandocentrum voor hun eigen bedrijf.

### 3. De "Alien Terminal / God Mode" (Jouw Systeem)
*   **Doelgroep:** Jij (De Supreme Overseer).
*   **Visuele Stijl:** Pure "Dark Matter". Diep zwart, met gouden en matrix-groene accenten. Bliksemsnel, rauw, en direct gekoppeld aan de database. Geen onnodige animaties, alleen pure data. Jouw laptop interface.

## User Review Required

> [!IMPORTANT]
> Dit vereist dat we in de code een **Dynamic Theme Engine** bouwen. Als je inlogt, krijgt je browser een onzichtbare stempel (`theme-free`, `theme-premium` of `theme-god`). 

## Open Questions

> [!WARNING]
> Mogen we voor de Gratis (Free) versie een compleet witte / lichtgrijze "Apple" stijl bouwen, zodat het contrast met de donkere, machtige Premium-versie maximaal is? (Dit maakt de drang om te betalen psychologisch veel groter).

## Proposed Changes

### 1. Theme Engine in Layout
We passen de `layout.tsx` en `globals.css` aan zodat CSS-variabelen (zoals achtergrondkleur, glow-effecten) afhankelijk zijn van de rol van de ingelogde gebruiker.

### 2. Component Rendering
Zware visuele componenten (zoals de 3D Wereldbol in het dashboard) worden met een `if (user.tier === 'PREMIUM')` alleen ingeladen voor betalende klanten. Gratis klanten krijgen een simpel statistieken-lijstje.

## Verification Plan
We loggen in als `starter@klant.nl` (Wit/Zwart, simpel), daarna als `premium@klant.nl` (Wereldbol, Blauw/Rood), en tot slot als `ceo@rebuildyourlife.com` (Alien Terminal Zwart).
